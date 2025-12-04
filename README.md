# 🚀 NextUnitech AI Platform  
### **Enterprise-Grade Production DevSecOps Architecture for a Full-Stack AI Application**

---

![GitHub last commit](https://img.shields.io/github/last-commit/nextunitech/main?color=blue&style=flat-square)
![Built With](https://img.shields.io/badge/Built%20With-React%20%7C%20FastAPI%20%7C%20MongoDB%20%7C%20Kubernetes-orange?style=flat-square)
![Infrastructure as Code](https://img.shields.io/badge/IaC-Terraform-success?style=flat-square)
![GitOps Enabled](https://img.shields.io/badge/GitOps-ArgoCD-critical?style=flat-square)
![DevSecOps](https://img.shields.io/badge/Security-Trivy%20%7C%20Gitleaks%20%7C%20SonarQube-important?style=flat-square)
![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey?style=flat-square)

---

## 📌 Executive Summary  

The **NextUnitech AI Platform** is a fully production-ready, secure, and automated DevSecOps environment built to emulate a real-world enterprise deployment model.  
It demonstrates a complete CI/CD + GitOps workflow with modern cloud-native tooling, including Kubernetes on AWS, Terraform-provisioned infrastructure, externalized secret management, vulnerability scanning, observability stack, and automated deployments.  
This repository is designed for engineers, architects, and recruiters seeking proof of advanced DevSecOps, SRE, and cloud engineering capability.

---

## 🖼️ Preview Screenshots

| Screenshot | Description |
|-----------|-------------|
| ![Home UI](photos/web1.jpg) | **Home UI Screenshot** |
| ![Application Operational View](photos/web2.jpg) | **Application Operational View** |
| ![CI Pipeline](photos/ci.jpg) | **CI (Jenkins) Pipeline Execution** |
| ![CD Pipeline](photos/cd.jpg) | **CD Pipeline Updating Kubernetes Manifests** |
| ![ArgoCD](photos/agrocd.jpg) | **ArgoCD GitOps Deployment View** |
| ![Grafana](photos/grafana.jpg) | **Monitoring Dashboard (Grafana)** |

---

## ✨ Feature Highlights  

- 🏗 **Infrastructure as Code (Terraform):** Automated AWS provisioning including VPC, subnets, routing, EC2 nodes, ALB, IAM.
- ☸️ **Self-Managed Kubernetes Cluster:** One control plane + multiple worker nodes provisioned manually for full operational understanding.
- 🔐 **DevSecOps Security Enforcement:**
  - Trivy filesystem & container scanning  
  - Gitleaks automated secret detection  
  - SonarQube SAST & quality gate enforcement  
  - OWASP Dependency-Check reporting  
- 🚀 **Modern CI/CD Architecture:**
  - Jenkins CI for build/test/scan  
  - ArgoCD GitOps-based CD with drift control  
- 🧩 **Full Observability Stack:** Prometheus + Grafana with alerting, visualization, and cluster-health dashboards.
- 🔑 **Secure External Secret Management:** AWS Secrets Manager + External Secrets Operator (no plaintext secrets in Git).
- 🧪 **Automated Quality Gates:** Builds fail if vulnerabilities, credential leaks, or low code quality are detected.
- 📦 **Container-based Architecture:** React frontend + FastAPI backend + MongoDB deployed as independent services.

---

## 🧱 System Architecture

```mermaid
graph TD

User -->|HTTPS| Route53
Route53 --> ALB
ALB --> NodePort

subgraph AWS
    subgraph Kubernetes Cluster
        NodePort --> Ingress

        Ingress -->|/| Frontend[React Frontend Pod]
        Ingress -->|/api| Backend[FastAPI Backend Pod]
        
        Backend --> Mongo[MongoDB StatefulSet]
        Backend --> ESO[External Secrets Operator]
    end
    ESO -->|Pull Secrets| AWSSecretsManager
end

Backend -->|AI Requests| OpenAIAPI
🔐 DevSecOps Pipeline Architecture
mermaid
Copy code
graph LR  
Developer --> GitHub  
GitHub --> JenkinsCI

subgraph CI
    JenkinsCI --> Tests[Jest / Pytest]
    Tests --> Scans[Trivy + Gitleaks + SonarQube + OWASP]
    Scans --> DockerBuild[Build & Tag Docker Images]
    DockerBuild --> DockerHub
    DockerBuild --> UpdateManifests
end

UpdateManifests --> GitOpsRepo

subgraph CD
    GitOpsRepo --> ArgoCD
    ArgoCD --> Kubernetes
end
🧰 Technology Stack
Layer	Technology
Cloud	AWS (EC2, VPC, ALB, IAM, Route53, Secrets Manager)
Container Runtime	containerd
Orchestration	Kubernetes (kubeadm cluster)
CI	Jenkins
CD / GitOps	ArgoCD
IaC	Terraform
Secrets	AWS Secrets Manager + External Secrets Operator
Monitoring	Prometheus + Grafana
Security	Trivy, Gitleaks, SonarQube, OWASP Dependency-Check
Frontend	React + Vite + Tailwind
Backend	FastAPI
Database	MongoDB

📍 Prerequisites
Requirement	Version
Terraform	≥ 1.5
kubectl	Latest
AWS CLI	v2
Docker	Latest
Helm	Latest
Domain Name	Required
OpenAI API Key	Required

💻 Local Setup
Clone the repository:

bash
Copy code
git clone https://github.com/nextunitech/nextunitech.git
cd nextunitech
🔍 Run Code Security Tools
Run Gitleaks:

bash
Copy code
docker run -v $PWD:/repo zricethezav/gitleaks detect --source="/repo" -v
Run Trivy:

bash
Copy code
trivy fs .
Run SonarQube (docker-based):

bash
Copy code
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts
Run OWASP Dependency Check:

bash
Copy code
dependency-check --scan .
▶ Run Application Locally
bash
Copy code
docker-compose up --build
Access:

Component	URL
Frontend	http://localhost:3000
Backend Docs	http://localhost:8000/docs
Database	localhost:27017

☁️ AWS Infrastructure Deployment (Terraform)
bash
Copy code
cd Infrastructure/terraform
terraform init
terraform plan
terraform apply --auto-approve
Resources created:

Custom VPC

Public/private subnets

ALB + Target Groups

EC2 Nodes (Kubernetes)

IAM Roles

☸ Kubernetes Bootstrap Guide
SSH into master node

Configure networking modules

Install containerd runtime

Install Kubernetes components

Initialize cluster:

bash
Copy code
sudo kubeadm init --pod-network-cidr=192.168.0.0/16
Install Calico CNI

Join worker nodes using kubeadm join

Deploy nginx ingress

Validate with:

bash
Copy code
kubectl get nodes
kubectl get pods -A
🔐 Secrets Management
AWS Secrets Manager example key structure:

arduino
Copy code
myapp/prod/config:
  MONGODB_URI
  OPENAI_API_KEY
  SESSION_SECRET
Install External Secrets Operator:

bash
Copy code
helm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets --create-namespace
Apply manifests:

bash
Copy code
kubectl apply -f deploy/k8s/secretstore.yaml
kubectl apply -f deploy/k8s/externalsecret.yaml
🚀 CI/CD with Jenkins + GitOps + ArgoCD
CI performs build, test, security scan, Docker image publishing

CD updates manifests → ArgoCD deploys to cluster automatically

Drift detection alerts ensure config integrity

📷 (Screenshots already included above)

📊 Monitoring & Observability
Install stack:

bash
Copy code
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
Access Grafana:

bash
Copy code
kubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
Credentials:

pgsql
Copy code
admin / prom-operator
Grafana dashboard image included above ☝️

🛠 Validation & Troubleshooting
Issue	Possible Cause	Resolution
Pods Pending	CNI missing	Reapply Calico
ArgoCD Out of Sync	Manifest mismatch	Sync manually or fix repo
CI Failure	Vulnerabilities detected	Fix security issues
Secret Missing	IAM role invalid	Validate AWS permissions
Ingress not working	Nginx not deployed	Reinstall ingress controller

🧹 Cleanup Guide (⚠ Cost Warning)
Destroy infrastructure:

bash
Copy code
cd Infrastructure/terraform
terraform destroy --auto-approve
📍 Roadmap
 Istio Service Mesh with mTLS

 Log aggregation via ELK stack

 Chaos Engineering (LitmusChaos)

 HA Kubernetes control plane

🤝 Contribution Guidelines
Fork repository

Create feature branch

Submit PR with description

📄 License
This project is licensed under:

Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
Redistribution for commercial use, paid training, SaaS monetization, or product resale is not permitted.

⭐ Call to Action
If this project helped you learn modern DevOps:

👉 Star the repository
👉 Fork it and deploy your own version
👉 Share your deployment on LinkedIn and tag the author

Built with passion for Cloud-Native Engineering & DevSecOps excellence.