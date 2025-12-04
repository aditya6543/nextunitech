🚀 Production-Grade DevSecOps Project
<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" />
  <img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Architecture-Production%20Grade-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Infrastructure-Terraform%20%2B%20AWS-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/Kubernetes-Multi--Node%20Cluster-326ce5?style=flat-square&logo=kubernetes&logoColor=white" />
  <img src="https://img.shields.io/badge/CI--CD-Jenkins-red?style=flat-square&logo=jenkins&logoColor=white" />
  <img src="https://img.shields.io/badge/Security-Gitleaks%20%2F%20Trivy%20%2F%20SonarQube-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/GitOps-ArgoCD-0aaaff?style=flat-square&logo=argo&logoColor=white" />
  <img src="https://img.shields.io/badge/Monitoring-Prometheus%20%2B%20Grafana-yellow?style=flat-square&logo=grafana&logoColor=white" />
  <img src="https://img.shields.io/badge/Stack-Fullstack%20App-green?style=flat-square" />
</p>
<p align="center"><img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" /><img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue?style=flat-square" /><img src="https://img.shields.io/badge/Architecture-Production%20Grade-orange?style=flat-square" /><img src="https://img.shields.io/badge/Infrastructure-Terraform%20%2B%20AWS-yellow?style=flat-square" /><img src="https://img.shields.io/badge/Kubernetes-Multi--Node%20Cluster-326ce5?style=flat-square&logo=kubernetes&logoColor=white" /><img src="https://img.shields.io/badge/CI--CD-Jenkins-red?style=flat-square&logo=jenkins&logoColor=white" /><img src="https://img.shields.io/badge/Security-Gitleaks%20%2F%20Trivy%20%2F%20SonarQube-orange?style=flat-square" /><img src="https://img.shields.io/badge/GitOps-ArgoCD-0aaaff?style=flat-square&logo=argo&logoColor=white" /><img src="https://img.shields.io/badge/Monitoring-Prometheus%20%2B%20Grafana-yellow?style=flat-square&logo=grafana&logoColor=white" /><img src="https://img.shields.io/badge/Stack-Fullstack%20App-green?style=flat-square" /></p>📸 Application Preview🖥️ Frontend & Dashboard<p align="center"><img src="photos/web1.jpg" alt="Application Interface" width="45%"><img src="photos/web2.jpg" alt="User Dashboard" width="45%"></p><p align="center"><i>Live application interface running on the Kubernetes cluster.</i></p>📌 Project OverviewThis repository serves as a blueprint for a modern, production-grade DevSecOps ecosystem. It goes beyond simple deployment scripts by integrating a full suite of enterprise tools for infrastructure automation, security compliance, observability, and continuous delivery.The core application is a Full-Stack AI Chatbot (React + FastAPI + MongoDB) capable of interacting with OpenAI's API. However, the primary focus of this project is the platform engineering around it:Infrastructure as Code: Fully automated AWS environment provisioning via Terraform.Container Orchestration: Self-managed Kubernetes cluster using Kubeadm.GitOps: Automated delivery using ArgoCD.DevSecOps: Integrated security scanning (Trivy, Gitleaks, SonarQube) within the CI pipeline.Observability: Real-time monitoring with Prometheus and Grafana.Secret Management: Secure injection of secrets using AWS Secrets Manager and External Secrets Operator.🏗️ System Architecture📍 High-Level ArchitectureCode snippetgraph TD
    User[User / Client] -->|HTTPS| ALB[AWS Load Balancer]
    ALB -->|Route Traffic| Ingress[NGINX Ingress Controller]
    
    subgraph "Kubernetes Cluster (AWS EC2)"
        Ingress -->|/| Front[Frontend Pod (React)]
        Ingress -->|/api| Back[Backend Pod (FastAPI)]
        
        Back -->|Read/Write| Mongo[MongoDB Pod]
        Back -->|Secret Sync| ESO[External Secrets Operator]
    end
    
    subgraph "AWS Services"
        ESO <-->|Fetch Secrets| ASM[AWS Secrets Manager]
        Back -->|AI Query| OpenAI[OpenAI API]
    end
📍 CI/CD + GitOps FlowCode snippetgraph LR
    Dev[Developer] -->|Push Code| Git[GitHub]
    
    subgraph "CI Pipeline (Jenkins)"
        Git -->|Webhook| Jenkins
        Jenkins -->|Test & Build| Docker[Docker Build]
        Jenkins -->|Security Scan| Scan[Trivy/Gitleaks/Sonar]
        Docker -->|Push Image| Hub[DockerHub]
        Jenkins -->|Update Manifest| GitOpsRepo[GitOps Repo]
    end
    
    subgraph "CD (ArgoCD)"
        GitOpsRepo -->|Sync| ArgoCD
        ArgoCD -->|Apply Manifests| K8s[Kubernetes Cluster]
    end
🧱 Technology Stack & FeaturesDomainTools UsedKey FeaturesCloud ProviderAWSEC2, VPC, IAM, Security Groups, Secrets ManagerInfrastructureTerraformModular IaC, State Management, Automated ProvisioningOrchestrationKubernetes (K8s)Kubeadm, Multi-node Cluster, NGINX IngressCI/CDJenkinsDeclarative Pipeline, Shared Libraries, Multi-stage BuildsGitOpsArgoCDAutomated Sync, Drift Detection, Application Health StatusSecurityTrivy, Gitleaks, SonarQubeImage Scanning, Secret Detection, Static Code AnalysisMonitoringPrometheus, GrafanaMetrics Collection, Custom Dashboards, AlertingSecretsExternal Secrets OperatorAWS Secrets Manager Integration, Kubernetes Secret SyncContainerizationDockerMulti-stage builds, Docker Compose for local devApplicationReact, Python (FastAPI), MongoDBModern full-stack architecture⚖️ Licensing Notice[!IMPORTANT]This project is protected by the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).You are free to:Share: Copy and redistribute the material in any medium or format.Adapt: Remix, transform, and build upon the material.Under the following terms:Attribution: You must give appropriate credit.NonCommercial: You may NOT use the material for commercial purposes (selling, SaaS, re-branding for clients).🛠️ PrerequisitesBefore setting up the pipeline, ensure you have the following:AWS Account with Admin permissions (Access Key & Secret Key).Domain Name (optional, for Ingress configuration).OpenAI API Key (for the chatbot functionality).DockerHub Account (for storing container images).Terraform & AWS CLI installed locally.💻 Local Development SetupTo run the application locally without the full K8s stack:Clone the repository:Bashgit clone https://github.com/aditya6543/nextunitch.git
cd nextunitch
Run with Docker Compose:Bashdocker-compose up --build
Access the App:Frontend: http://localhost:3000Backend API: http://localhost:8000/docsRun Security Scans Locally:Bash# Run Trivy filesystem scan
trivy fs .

# Run Gitleaks to check for secrets
gitleaks detect --source . -v
☁️ Infrastructure Deployment (Terraform)We use Terraform to provision the underlying AWS infrastructure required for the Kubernetes cluster.Navigate to the terraform directory:Bashcd terraform/
Initialize and Apply:Bashterraform init
terraform plan
terraform apply --auto-approve
This will create:VPC, Subnets, Internet Gateway, Route Tables.Security Groups (allowing ports 22, 80, 443, 6443, 30000-32767).3 EC2 Instances (1 Master Node, 2 Worker Nodes).IAM Roles for Secrets Manager access.☸️ Kubernetes Cluster SetupOnce the EC2 instances are running, we bootstrap the cluster using kubeadm.Initialize Master Node:Bashsudo kubeadm init --pod-network-cidr=192.168.0.0/16
Install CNI (Calico):Bashkubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.25.0/manifests/calico.yaml
Join Worker Nodes:Run the kubeadm join command output from the master initialization on the worker nodes.Install NGINX Ingress Controller:Bashkubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/baremetal/deploy.yaml
🔐 Secrets ManagementWe do not store secrets in Git. Instead, we use the External Secrets Operator (ESO) to fetch secrets dynamically from AWS Secrets Manager.Create Secret in AWS Secrets Manager:Name: myapp/production/configKey/Values: MONGODB_URI, OPENAI_API_KEY, SESSION_SECRET.Install ESO:Bashhelm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets --create-namespace
Apply SecretStore & ExternalSecret Manifests:Bashkubectl apply -f deploy/k8s/secretstore.yaml
kubectl apply -f deploy/k8s/externalsecret.yaml
The externalsecret.yaml will automatically create a native Kubernetes Secret named chatbot-config.🔄 CI/CD PipelineWe use Jenkins for CI and ArgoCD for GitOps-based CD.1. Continuous Integration (Jenkins)The Jenkinsfile.ci handles the build process:Checkout: Pulls code from GitHub.Unit Tests: Runs pytest for backend and Jest for frontend.Security Scan:Trivy: Scans the filesystem for vulnerabilities.Gitleaks: Checks git history for hardcoded secrets.SonarQube: Performs static code analysis.Build & Push: Builds Docker images and pushes them to DockerHub with the commit SHA tag.2. Continuous Delivery (ArgoCD)The Jenkinsfile.cd handles deployment:Update Manifests: Jenkins updates deploy/k8s/*.yaml with the new image tag.Commit & Push: Changes are committed back to the repo.ArgoCD Sync: ArgoCD detects the change in the repo and syncs the live cluster state.🐙 GitOps Deployment (ArgoCD)ArgoCD is the heart of our deployment strategy, ensuring the cluster state always matches the Git repository.Install ArgoCD:Bashkubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
Access Dashboard:Port-forward the UI: kubectl port-forward svc/argocd-server -n argocd 8080:443Login using the initial admin password stored in Kubernetes secrets.📊 Monitoring & ObservabilityWe use Prometheus for metrics scraping and Grafana for visualization.1. Install Kube-Prometheus StackBashhelm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
2. Grafana DashboardsPre-configured dashboards include:Cluster Overview: CPU/Memory usage of Nodes.Pod Monitoring: Individual pod health and restart counts.Application Metrics: Request latency and error rates (via ServiceMonitor).🧹 Cleanup & Costs Warning⚠️ Running 3 EC2 instances and an ALB on AWS incurs costs.To avoid unexpected charges, destroy the infrastructure when finished:Bashcd terraform/
terraform destroy --auto-approve
🤝 Contribution GuidelinesContributions are welcome! If you have ideas for improvements:Fork the repository.Create a feature branch (git checkout -b feature/NewFeature).Commit your changes.Push to the branch.Open a Pull Request.📜 LicenseThis project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0). It is intended for educational and portfolio purposes only.⭐ Call to ActionIf you found this project useful or learned something new, please support it:⭐ Star this repository on GitHub!🍴 Fork it to experiment with your own pipeline.🔗 Share it on LinkedIn and tag me.<p align="center"><i>Built with ❤️ by Aditya Kapse</i></p>