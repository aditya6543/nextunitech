# **🚀 NextUnitech AI Platform**

### **Enterprise-Grade Production DevSecOps Architecture for a Full-Stack AI Application**

<p align="center"> <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" /> <img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue?style=flat-square" /> <img src="https://img.shields.io/badge/Architecture-Production%20Grade-orange?style=flat-square" /> <img src="https://img.shields.io/badge/Infrastructure-Terraform%20%2B%20AWS-yellow?style=flat-square" /> <img src="https://img.shields.io/badge/Kubernetes-Multi--Node%20Cluster-326ce5?style=flat-square&logo=kubernetes&logoColor=white" /> <img src="https://img.shields.io/badge/CI--CD-Jenkins-red?style=flat-square&logo=jenkins&logoColor=white" /> <img src="https://img.shields.io/badge/Security-Gitleaks%20%2F%20Trivy%20%2F%20SonarQube-orange?style=flat-square" /> <img src="https://img.shields.io/badge/GitOps-ArgoCD-0aaaff?style=flat-square&logo=argo&logoColor=white" /> <img src="https://img.shields.io/badge/Monitoring-Prometheus%20%2B%20Grafana-yellow?style=flat-square&logo=grafana&logoColor=white" /> <img src="https://img.shields.io/badge/Stack-Fullstack%20App-green?style=flat-square" /> </p>

## **📌 Executive Summary**

The **NextUnitech AI Platform** is a fully production-ready, secure, and automated DevSecOps environment built to emulate a real-world enterprise deployment model. It demonstrates a complete **CI/CD \+ GitOps workflow** with modern cloud-native tooling, including Kubernetes on AWS, Terraform-provisioned infrastructure, externalized secret management, vulnerability scanning, observability stack, and automated deployments.

This repository is designed for engineers, architects, and recruiters seeking proof of advanced DevSecOps, SRE, and cloud engineering capability.

## **📖 Table of Contents**

* [Executive Summary](https://www.google.com/search?q=%23-executive-summary)  
* [Preview Screenshots](https://www.google.com/search?q=%23-preview-screenshots)  
* [Feature Highlights](https://www.google.com/search?q=%23-feature-highlights)  
* [System Architecture](https://www.google.com/search?q=%23-system-architecture)  
* [DevSecOps Pipeline](https://www.google.com/search?q=%23-devsecops-pipeline-architecture)  
* [Technology Stack](https://www.google.com/search?q=%23-technology-stack)  
* [Prerequisites](https://www.google.com/search?q=%23-prerequisites)  
* [Local Setup](https://www.google.com/search?q=%23-local-setup)  
* [AWS Infrastructure (Terraform)](https://www.google.com/search?q=%23-aws-infrastructure-deployment-terraform)  
* [Kubernetes Bootstrap](https://www.google.com/search?q=%23-kubernetes-bootstrap-guide)  
* [Secrets Management](https://www.google.com/search?q=%23-secrets-management)  
* [CI/CD & GitOps](https://www.google.com/search?q=%23-cicd-with-jenkins--gitops--argocd)  
* [Monitoring & Observability](https://www.google.com/search?q=%23-monitoring--observability)  
* [Troubleshooting](https://www.google.com/search?q=%23-validation--troubleshooting)  
* [Cleanup](https://www.google.com/search?q=%23-cleanup-guide--cost-warning)  
* [Roadmap & Contribution](https://www.google.com/search?q=%23-roadmap)  
* [License](https://www.google.com/search?q=%23-license)

## **🖼️ Preview Screenshots**

| Screenshot | Description |

|-----------|-------------|

| ![Home UI](photos/web1.jpg) | **Home UI Screenshot** |

| ![Application Operational View](photos/web2.jpg) | **Application Operational View** |

| ![CI Pipeline](photos/ci.jpg) | **CI (Jenkins) Pipeline Execution** |

| ![CD Pipeline](photos/cd.jpg) | **CD Pipeline Updating Kubernetes Manifests** |

| ![ArgoCD](photos/agrocd.jpg) | **ArgoCD GitOps Deployment View** |

| ![Grafana](photos/grafana.jpg) | **Monitoring Dashboard (Grafana)** |


## **✨ Feature Highlights**

* **🏗 Infrastructure as Code (Terraform):** Automated AWS provisioning including VPC, subnets, routing, EC2 nodes, ALB, IAM.  
* **☸️ Self-Managed Kubernetes Cluster:** One control plane \+ multiple worker nodes provisioned manually for full operational understanding (kubeadm).  
* **🔐 DevSecOps Security Enforcement:**  
  * **Trivy:** Filesystem & container scanning.  
  * **Gitleaks:** Automated secret detection.  
  * **SonarQube:** SAST & quality gate enforcement.  
  * **OWASP Dependency-Check:** Reporting on vulnerable dependencies.  
* **🚀 Modern CI/CD Architecture:**  
  * **Jenkins CI** for build/test/scan.  
  * **ArgoCD** for GitOps-based CD with drift control.  
* **🧩 Full Observability Stack:** Prometheus \+ Grafana with alerting, visualization, and cluster-health dashboards.  
* **🔑 Secure External Secret Management:** AWS Secrets Manager \+ External Secrets Operator (no plaintext secrets in Git).  
* **🧪 Automated Quality Gates:** Builds fail if vulnerabilities, credential leaks, or low code quality are detected.  
* **📦 Container-based Architecture:** React frontend \+ FastAPI backend \+ MongoDB deployed as independent services.

## **🧱 System Architecture**

graph TD  
    User\[User / Client\] \--\>|HTTPS| Route53  
    Route53 \--\> ALB\[Application Load Balancer\]  
    ALB \--\> NodePort

    subgraph AWS\_Cloud \[AWS Cloud\]  
        subgraph Kubernetes\_Cluster \[Kubernetes Cluster\]  
            NodePort \--\> Ingress\[Nginx Ingress\]  
            Ingress \--\>|/| Frontend\[React Frontend Pod\]  
            Ingress \--\>|/api| Backend\[FastAPI Backend Pod\]  
              
            Backend \--\> Mongo\[MongoDB StatefulSet\]  
            Backend \--\> ESO\[External Secrets Operator\]  
        end  
        ESO \--\>|Pull Secrets| AWSSecretsManager  
    end

    Backend \--\>|AI Requests| OpenAIAPI

## **🔐 DevSecOps Pipeline Architecture**

graph LR    
    Developer \--\>|Push Code| GitHub    
    GitHub \--\>|Webhook| JenkinsCI

    subgraph CI \[Continuous Integration\]  
        JenkinsCI \--\> Tests\[Jest / Pytest\]  
        Tests \--\> Scans\[Trivy \+ Gitleaks \+ SonarQube \+ OWASP\]  
        Scans \--\> DockerBuild\[Build & Tag Docker Images\]  
        DockerBuild \--\> DockerHub  
        DockerBuild \--\> UpdateManifests\[Update K8s Manifests\]  
    end

    UpdateManifests \--\> GitOpsRepo

    subgraph CD \[Continuous Delivery\]  
        GitOpsRepo \--\> ArgoCD  
        ArgoCD \--\> Kubernetes  
    end

## **🧰 Technology Stack**

| Layer | Technology |
| :---- | :---- |
| **Cloud** | AWS (EC2, VPC, ALB, IAM, Route53, Secrets Manager) |
| **Container Runtime** | containerd |
| **Orchestration** | Kubernetes (kubeadm cluster) |
| **CI** | Jenkins |
| **CD / GitOps** | ArgoCD |
| **IaC** | Terraform |
| **Secrets** | AWS Secrets Manager \+ External Secrets Operator |
| **Monitoring** | Prometheus \+ Grafana |
| **Security** | Trivy, Gitleaks, SonarQube, OWASP Dependency-Check |
| **Frontend** | React \+ Vite \+ Tailwind |
| **Backend** | FastAPI |
| **Database** | MongoDB |

## **📍 Prerequisites**

Before you begin, ensure you have the following tools installed:

| Requirement | Version |
| :---- | :---- |
| **Terraform** | ≥ 1.5 |
| **kubectl** | Latest |
| **AWS CLI** | v2 |
| **Docker** | Latest |
| **Helm** | Latest |
| **Domain Name** | Required (for Ingress/Route53) |
| **OpenAI API Key** | Required (for App Logic) |

## **💻 Local Setup**

**1\. Clone the repository**

git clone \[https://github.com/nextunitech/nextunitech.git\](https://github.com/nextunitech/nextunitech.git)  
cd nextunitech

2\. Run Code Security Tools  
Before deployment, run the security suite locally to validate code integrity.  
*Run Gitleaks:*

docker run \-v $PWD:/repo zricethezav/gitleaks detect \--source="/repo" \-v

*Run Trivy:*

trivy fs .

*Run SonarQube (docker-based):*

docker run \-d \--name sonarqube \-p 9000:9000 sonarqube:lts  
\# Access at http://localhost:9000 (admin/admin)

**3\. Run Application Locally**

docker-compose up \--build

**Access Points:**

* **Frontend:** http://localhost:3000  
* **Backend Docs:** http://localhost:8000/docs  
* **Database:** localhost:27017

## **☁️ AWS Infrastructure Deployment (Terraform)**

Provision the custom VPC, Subnets, ALB, and EC2 instances.

cd Infrastructure/terraform

\# Initialize Terraform  
terraform init

\# Review Plan  
terraform plan

\# Apply Infrastructure  
terraform apply \--auto-approve

**Resources Created:**

* Custom VPC & Public/Private Subnets  
* ALB \+ Target Groups  
* EC2 Nodes (Master \+ Workers)  
* IAM Roles

## **☸ Kubernetes Bootstrap Guide**

Since this is a self-managed cluster, you must bootstrap it manually (or use the provided scripts in Infrastructure/scripts).

1. **SSH into master node.**  
2. **Run setup scripts:**  
   * Configure networking modules (bridgedtraffic.sh).  
   * Install containerd runtime (containerruntime.sh).  
   * Install Kubernetes components (inskubeadm.sh).  
3. **Initialize Cluster:**  
   sudo kubeadm init \--pod-network-cidr=192.168.0.0/16

4. **Install CNI (Calico):**  
   kubectl apply \-f \[https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml\](https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml)

5. **Join Worker Nodes:** Use the kubeadm join command output from step 3 on your worker nodes.  
6. **Validate:**  
   kubectl get nodes  
   kubectl get pods \-A

## **🔐 Secrets Management**

We do **not** store secrets in Git. We use **AWS Secrets Manager** synced via **External Secrets Operator**.

1. Create Secret in AWS:  
   Structure: myapp/prod/config  
   {  
     "MONGODB\_URI": "...",  
     "OPENAI\_API\_KEY": "...",  
     "SESSION\_SECRET": "..."  
   }

2. **Install External Secrets Operator:**  
   helm repo add external-secrets \[https://charts.external-secrets.io\](https://charts.external-secrets.io)  
   helm install external-secrets external-secrets/external-secrets \-n external-secrets \--create-namespace

3. **Apply Manifests:**  
   kubectl apply \-f deploy/k8s/secretstore.yaml  
   kubectl apply \-f deploy/k8s/externalsecret.yaml

## **🚀 CI/CD with Jenkins \+ GitOps \+ ArgoCD**

1. **CI (Jenkins):**  
   * Triggers on commit.  
   * Runs Tests (Jest/Pytest).  
   * Runs Security Scans (Trivy, Gitleaks, Sonar).  
   * Builds Docker Image & Pushes to Registry.  
   * Updates image:tag in the Kubernetes manifests repo.  
2. **CD (ArgoCD):**  
   * Detects change in Git manifests.  
   * Automatically syncs cluster state.  
   * Provides drift detection and self-healing.

## **📊 Monitoring & Observability**

**1\. Install Stack:**

helm repo add prometheus-community \[https://prometheus-community.github.io/helm-charts\](https://prometheus-community.github.io/helm-charts)  
helm install prometheus prometheus-community/kube-prometheus-stack \-n monitoring \--create-namespace

**2\. Access Grafana:**

kubectl port-forward svc/prometheus-grafana 3000:80 \-n monitoring

*Login with: admin / prom-operator*

## **🛠 Validation & Troubleshooting**

| Issue | Possible Cause | Resolution |
| :---- | :---- | :---- |
| **Pods Pending** | CNI missing | Reapply Calico manifest. |
| **ArgoCD Out of Sync** | Manifest mismatch | Sync manually via UI or fix repo. |
| **CI Failure** | Vulnerabilities detected | Fix security issues in code/deps. |
| **Secret Missing** | IAM role invalid | Validate AWS permissions & Trust Policy. |
| **Ingress 404** | Nginx not deployed | Reinstall ingress controller. |

## **🧹 Cleanup Guide (⚠ Cost Warning)**

To avoid unexpected AWS charges, destroy the infrastructure when finished.

cd Infrastructure/terraform  
terraform destroy \--auto-approve

## **📍 Roadmap**

* \[ \] Istio Service Mesh with mTLS  
* \[ \] Log aggregation via ELK stack  
* \[ \] Chaos Engineering (LitmusChaos)  
* \[ \] HA Kubernetes control plane (Multi-master)

## **🤝 Contribution Guidelines**

1. Fork repository.  
2. Create feature branch (git checkout \-b feature/AmazingFeature).  
3. Commit changes.  
4. Submit Pull Request.

## **📄 License**

This project is licensed under **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**.

* **Allowed:** Personal learning, portfolio use, non-commercial forks.  
* **Forbidden:** Commercial resale, paid training, or SaaS monetization.

## **⭐ Call to Action**

If this project helped you learn modern DevOps:

👉 **Star the repository** 👉 **Fork it and deploy your own version** 👉 **Share your deployment on LinkedIn** *Built with passion for Cloud-Native Engineering & DevSecOps excellence.*