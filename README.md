# Exploring Istio Service Mesh on MicroK8s: A Learning Report
## Abstract

This report documents my exploration and learning journey with Istio service mesh on a resource-constrained MicroK8s environment. The aim was to understand how Istio integrates with Kubernetes, the role of its control and data planes, sidecar injection, traffic routing, observability, and resilience features such as retries and outlier detection. The findings provide a foundation for implementing service mesh patterns in microservice architectures while maintaining simplified application logic.

### 1. Introduction

Service meshes have emerged as a powerful solution for managing microservices communication, providing security, traffic management, and observability without requiring changes to application code. Istio, a leading service mesh implementation, introduces a data plane (Envoy sidecars) and control plane (Istiod) to manage service-to-service traffic. This exploration was performed on MicroK8s, a lightweight Kubernetes distribution, to understand Istio’s functionality in a constrained environment.

### 2. Setting Up Istio on MicroK8s

Installed Istio using MicroK8s’ istioctl tool.

Verified installation included:

Istio core components

Istiod control plane

Ingress and egress gateways

Enabled automatic sidecar injection for the default namespace:

kubectl label namespace default istio-injection=enabled


Verified sidecar injection by observing pod container counts (2/2 for app + istio-proxy) and Envoy ports.

### 3. Understanding Istio Components

Control Plane (Istiod): Manages configuration, service discovery, and certificate issuance.

Data Plane (Envoy sidecars): Intercepts traffic between services for routing, retries, telemetry, and security.

Ingress Gateway: Routes external traffic into the cluster, providing advanced routing and TLS termination.

Egress Gateway: Manages outbound traffic from the mesh.

### 4. Deploying a Sample Service

Deployed inventory-api service with a corresponding ClusterIP service.

Created Istio Gateway and VirtualService to expose /inventory endpoint externally.

Tested routing via ingress:

`curl -I http://<istio-ingress-ip>/inventory`


Learned that requests not matching the VirtualService prefix return 404 Not Found.

Observed that Istio handles traffic routing transparently through sidecars.

### 5. Traffic Management Features
#### 5.1 Retries

Istio can automatically retry failed requests without modifying application code.

Retries are configured via DestinationRule targeting the backend service (Service B) for requests coming from Service A.

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: inventory-retries
  namespace: default
spec:
  host: inventory-api-service   # <-- target backend service
  trafficPolicy:
    connectionPool:
      tcp:
        maxRetries: 3
```


Advantages:

Centralized retry logic

Consistent behavior across services

Reduced application complexity

#### 5.2 Outlier Detection

Automatically ejects unhealthy endpoints from the load pool.

Key configurable parameters:

consecutive5xxErrors, consecutiveGatewayErrors

interval, baseEjectionTime, maxEjectionPercent

Example:

outlierDetection:
  consecutive5xxErrors: 5
  consecutiveGatewayErrors: 3
  interval: 10s
  baseEjectionTime: 60s
  maxEjectionPercent: 50


Works together with retries and circuit breakers for resilient service calls.

### 6. Observability

Istio provides distributed tracing, telemetry, and metrics without modifying application code.

Envoy sidecars can export metrics to Prometheus, logs to Loki, and traces to Jaeger or Grafana.

Example of tracing a request:

`Service A → Envoy → Service B → Database`


Metrics like response times, bottlenecks, and outliers are automatically captured.

### 7. Key Learnings

Istio enhances Kubernetes networking but does not replace the underlying CNI data plane.

Sidecar injection enables transparent traffic management for applications.

Gateway and VirtualService resources provide advanced routing capabilities.

Resilience features, such as retries, outlier detection, and circuit breakers, can be applied at the mesh level, thereby reducing application code complexity.

Observability features are built-in, making distributed tracing, metrics, and monitoring seamless.

Resource constraints necessitate careful planning when enabling Istio on lightweight clusters, such as MicroK8s.

### 8. Next Steps

Experiment with prefix stripping in VirtualService for cleaner backend paths.

Explore circuit breakers, timeouts, and fault injection.

Integrate Istio metrics with Loki + Grafana to visualise service performance.

Test resilience under failure scenarios to understand retry and outlier behaviour.

### 9. Conclusion

This exploration demonstrates that Istio can significantly improve microservice architecture by abstracting service-to-service traffic concerns, providing observability, and centralising resilience mechanisms. Understanding its components, configuration, and interaction with Kubernetes is crucial for effective deployment and management in production-grade environments.
