{{- define "ghostshell.name" -}}
ghostshell
{{- end -}}

{{- define "ghostshell.fullname" -}}
{{ include "ghostshell.name" . }}
{{- end -}}
