"use client"

import { useState, useEffect } from "react"
import Joyride, { type Step, type CallBackProps } from "react-joyride"
import { useTheme } from "next-themes"

export function GuidedTour() {
  const [isMounted, setIsMounted] = useState(false)
  const [run, setRun] = useState(false)
  const { theme } = useTheme()

  const steps: Step[] = [
    {
      target: "#tour-step-1-sections",
      content: "This is where you can add or remove sections from your portfolio.",
      disableBeacon: true,
    },
    {
      target: "#tour-step-2-actions",
      content: "Here you can preview, export, or reset your portfolio.",
    },
    {
      target: "#tour-step-3-preview",
      content: "This is the live preview of your portfolio. Changes you make will appear here instantly.",
    },
    {
      target: "#tour-step-4-settings-hero",
      content: "Click this button to open the editor for a specific section.",
    },
    {
      target: "#tour-step-5-editor",
      content: "In the editor panel, you can customize the content of the selected section.",
    },
  ]

  useEffect(() => {
    setIsMounted(true)
    const tourSeen = localStorage.getItem("portfolioBuilderTourSeen")
    if (!tourSeen) {
      setRun(true)
    }
  }, [])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    const finishedStatuses: string[] = ["finished", "skipped"]

    if (finishedStatuses.includes(status)) {
      setRun(false)
      localStorage.setItem("portfolioBuilderTourSeen", "true")
    }
  }

  useEffect(() => {
    const handleRestart = () => setRun(true)
    window.addEventListener("restart-tour", handleRestart)
    return () => window.removeEventListener("restart-tour", handleRestart)
  }, [])
  
  if (!isMounted) return null

  return (
    <Joyride
      run={run}
      steps={steps}
      continuous
      showProgress
      showSkipButton
      disableScrolling
      callback={handleJoyrideCallback}
      styles={{
        options: {
          arrowColor: theme === 'dark' ? '#1f2937' : '#fff',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
          overlayColor: "rgba(0, 0, 0, 0.75)",
          primaryColor: "#3b82f6",
          textColor: theme === 'dark' ? '#f3f4f6' : '#1f2937',
        },
      }}
    />
  )
} 