import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { emergencyScenarios, EmergencyScenario } from "@/data/emergencyScenarios";

interface CameraAnalysis {
  detected: boolean;
  scenarioId: string | null;
  confidence: "high" | "medium" | "low";
  description: string;
}

export function useCamera() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CameraAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
      });
      streamRef.current = stream;
      setIsCapturing(true);
      return stream;
    } catch (e) {
      setError("Camera access denied. Please allow camera permissions.");
      return null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setIsCapturing(false);
  }, []);

  const captureAndAnalyze = useCallback(async (video: HTMLVideoElement): Promise<EmergencyScenario | null> => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      setPreview(dataUrl);
      const base64 = dataUrl.split(",")[1];

      const { data, error: fnError } = await supabase.functions.invoke("analyze-image", {
        body: { imageBase64: base64 },
      });

      if (fnError) throw new Error(fnError.message);

      setAnalysis(data);

      if (data.detected && data.scenarioId) {
        return emergencyScenarios.find((s) => s.id === data.scenarioId) || null;
      }
      return null;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPreview(null);
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    isCapturing,
    isAnalyzing,
    preview,
    analysis,
    error,
    startCamera,
    stopCamera,
    captureAndAnalyze,
    reset,
    videoRef,
    streamRef,
  };
}
