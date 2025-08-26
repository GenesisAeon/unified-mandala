; AutoHotkey Hooks Script
; Provides advanced hotkey and input sequence support for the Windows OS Bridge.

#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases
SendMode Input
SetWorkingDir %A_ScriptDir%

; Ctrl+Alt+N - Open Notepad
^!n::Run, notepad.exe

; Ctrl+Alt+S - Launch Snipping Tool for quick screenshots
^!s::
    Run, snippingtool.exe
return

; Ctrl+Alt+O - Notify local OS bridge service about an automation event
^!o::
    Run, powershell.exe -Command "Invoke-RestMethod -Uri http://localhost:3333/hotkey -Method Post -Body @{event='open'}"
return
