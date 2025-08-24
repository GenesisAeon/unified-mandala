; Mandala AutoHotkey Template
; Provides a sample hotkey for triggering Mandala automation

#NoEnv  ; Recommended for performance
SendMode Input
SetWorkingDir %A_ScriptDir%

; Ctrl+Alt+M opens a placeholder Mandala command prompt
^!m::
    Run, powershell.exe -NoExit -Command "echo Mandala ready"
return
