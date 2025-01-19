'use client'

import { useState, useEffect } from 'react'
import { Timer, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/use-toast'
import type { Recipe } from '@/types/recipe'

interface CookingGuidanceProps {
  recipe: Recipe
  onCompleteAction: () => void
  onExitAction: () => void
}

interface StepTimerProps {
  timeInSeconds: number
  onCompleteAction: () => void
}

interface StepInstructionProps {
  instruction: string
  stepNumber: number
  isCompleted: boolean
  onToggleCompleteAction: () => void
  timer?: number
}

interface NavigationBarProps {
  currentStep: number
  totalSteps: number
  onPreviousAction: () => void
  onNextAction: () => void
  onExitAction: () => void
  progress: number
}

interface Instruction {
  description: string
}

function StepTimer({ timeInSeconds, onCompleteAction }: StepTimerProps) {
  const [timeLeft, setTimeLeft] = useState(timeInSeconds)
  const { toast } = useToast()

  useEffect(() => {
    if (timeLeft <= 0) {
      onCompleteAction()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, onCompleteAction])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="mt-4 flex items-center gap-2 text-sm">
      <Timer className="h-4 w-4" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  )
}

function StepInstruction({ instruction, stepNumber, isCompleted, onToggleCompleteAction, timer }: StepInstructionProps) {
  return (
    <div className="rounded-lg border p-6">
      <p className="text-lg">{instruction}</p>
      
      {timer && (
        <StepTimer 
          timeInSeconds={timer} 
          onCompleteAction={() => {}} 
        />
      )}

      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={onToggleCompleteAction}
      >
        {isCompleted ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Completed
          </>
        ) : (
          'Mark as Complete'
        )}
      </Button>
    </div>
  )
}

function NavigationBar({ currentStep, totalSteps, onPreviousAction, onNextAction, onExitAction, progress }: NavigationBarProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="sm" onClick={onExitAction}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Exit
      </Button>
      <Progress value={progress} className="w-32" />
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onPreviousAction}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={onNextAction}>
          {currentStep === totalSteps - 1 ? (
            'Finish'
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export function CookingGuidance({ recipe, onCompleteAction, onExitAction }: CookingGuidanceProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const extractTimeFromInstruction = (instruction: Instruction | string): number | undefined => {
    const text = typeof instruction === 'string' ? instruction : instruction.description
    const timeMatch = text.match(/(\d+)\s*(?:minute|min|minutes|mins?)/i)
    return timeMatch ? parseInt(timeMatch[1], 10) * 60 : undefined
  }

  const handleNext = () => {
    if (currentStep < recipe.instructions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = () => {
    toast({
      title: 'Recipe Complete!',
      description: 'Great job! Your dish is ready.',
    })
    onCompleteAction()
  }

  const toggleStepCompletion = (stepIndex: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepIndex)
        ? prev.filter(step => step !== stepIndex)
        : [...prev, stepIndex]
    )
  }

  const progress = (completedSteps.length / recipe.instructions.length) * 100

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <NavigationBar
        currentStep={currentStep}
        totalSteps={recipe.instructions.length}
        onPreviousAction={handlePrevious}
        onNextAction={handleNext}
        onExitAction={onExitAction}
        progress={progress}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <p className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {recipe.instructions.length}
        </p>
      </div>

      <StepInstruction
        instruction={recipe.instructions[currentStep]}
        stepNumber={currentStep + 1}
        isCompleted={completedSteps.includes(currentStep)}
        onToggleCompleteAction={() => toggleStepCompletion(currentStep)}
        timer={extractTimeFromInstruction(recipe.instructions[currentStep])}
      />
    </div>
  )
}
