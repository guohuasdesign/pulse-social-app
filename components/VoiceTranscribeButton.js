"use client";

import { useRef, useState } from "react";

function MicrophoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v3" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 8h8v8H8z" />
    </svg>
  );
}

export default function VoiceTranscribeButton({
  disabled = false,
  onError,
  onTranscript,
  title = "Speak",
}) {
  const audioChunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  async function transcribeAudio(audioBlob) {
    setIsTranscribing(true);
    onError?.("");

    const formData = new FormData();
    formData.append("audio", audioBlob, "comment.webm");

    const response = await fetch("/api/speech-to-text", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setIsTranscribing(false);

    if (!response.ok) {
      onError?.(data.error ?? "Could not transcribe audio.");
      return;
    }

    const transcript = data.text?.trim();

    if (!transcript) {
      onError?.("No speech was detected.");
      return;
    }

    onTranscript(transcript);
  }

  async function startRecording() {
    onError?.("");

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      onError?.("Your browser does not support voice recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      audioChunksRef.current = [];
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        stream.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current = null;

        if (audioBlob.size > 0) {
          transcribeAudio(audioBlob);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      onError?.("Microphone permission was denied.");
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === "inactive") return;

    recorder.stop();
    setIsRecording(false);
  }

  return (
    <button
      type="button"
      aria-label={
        isRecording ? "Stop recording" : isTranscribing ? "Transcribing" : title
      }
      className="flex h-10 w-10 items-center justify-center rounded-full border transition-transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled || isTranscribing}
      style={{
        background: isRecording ? "rgba(220, 38, 38, 0.88)" : "var(--accent)",
        borderColor: isRecording ? "rgba(220, 38, 38, 0.24)" : "transparent",
        color: "#faf8f2",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.13)",
      }}
      title={
        isRecording ? "Stop recording" : isTranscribing ? "Transcribing..." : title
      }
    >
      {isRecording ? <StopIcon /> : <MicrophoneIcon />}
    </button>
  );
}
