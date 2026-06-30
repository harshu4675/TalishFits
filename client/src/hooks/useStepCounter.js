import { useState, useEffect, useRef } from "react";

const STEP_THRESHOLD = 1.2;
const STEP_COOLDOWN = 250;
const STORAGE_KEY = "talishfits_steps";

export const useStepCounter = ({ enabled = false, onStepUpdate } = {}) => {
  const [steps, setSteps] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        const today = new Date().toDateString();
        if (data.date === today) {
          return data.steps;
        }
      }
    } catch {}
    return 0;
  });

  const [isActive, setIsActive] = useState(false);
  const [permission, setPermission] = useState("prompt");
  const [error, setError] = useState(null);

  const lastStepTime = useRef(0);
  const lastMagnitude = useRef(0);
  const accelHandler = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const today = new Date().toDateString();
    const stored = localStorage.getItem(STORAGE_KEY);

    try {
      const data = stored ? JSON.parse(stored) : null;
      if (!data || data.date !== today) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ date: today, steps: 0 }),
        );
        setSteps(0);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (steps > 0) {
      const today = new Date().toDateString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, steps }));
      if (onStepUpdate) {
        onStepUpdate(steps);
      }
    }
  }, [steps, onStepUpdate]);

  const handleMotion = (event) => {
    if (!event.accelerationIncludingGravity) return;

    const { x = 0, y = 0, z = 0 } = event.accelerationIncludingGravity;
    const magnitude = Math.sqrt(x * x + y * y + z * z);
    const delta = Math.abs(magnitude - lastMagnitude.current);
    const now = Date.now();

    if (delta > STEP_THRESHOLD && now - lastStepTime.current > STEP_COOLDOWN) {
      setSteps((prev) => prev + 1);
      lastStepTime.current = now;
    }

    lastMagnitude.current = magnitude;
  };

  const requestPermission = async () => {
    setError(null);

    if (typeof DeviceMotionEvent === "undefined") {
      setError("Device motion not supported");
      return false;
    }

    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        setPermission(result);
        return result === "granted";
      } catch (err) {
        setError("Permission denied");
        return false;
      }
    } else {
      setPermission("granted");
      return true;
    }
  };

  const start = async () => {
    const granted = await requestPermission();
    if (!granted) return false;

    accelHandler.current = handleMotion;
    window.addEventListener("devicemotion", accelHandler.current);
    setIsActive(true);
    return true;
  };

  const stop = () => {
    if (accelHandler.current) {
      window.removeEventListener("devicemotion", accelHandler.current);
      accelHandler.current = null;
    }
    setIsActive(false);
  };

  const reset = () => {
    setSteps(0);
    const today = new Date().toDateString();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: today, steps: 0 }),
    );
  };

  const addManualSteps = (amount) => {
    setSteps((prev) => Math.max(0, prev + amount));
  };

  useEffect(() => {
    return () => {
      if (accelHandler.current) {
        window.removeEventListener("devicemotion", accelHandler.current);
      }
    };
  }, []);

  useEffect(() => {
    if (enabled && !isActive) {
      start();
    } else if (!enabled && isActive) {
      stop();
    }
  }, [enabled]);

  return {
    steps,
    isActive,
    permission,
    error,
    start,
    stop,
    reset,
    addManualSteps,
  };
};

export default useStepCounter;
