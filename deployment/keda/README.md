# KEDA Scaling for Go-Agent

This configuration uses KEDA to scale the `go-agent` deployment based on the length of the `tasks` NATS subject.

Apply with:

```bash
kubectl apply -f scaledobject.yaml
```
