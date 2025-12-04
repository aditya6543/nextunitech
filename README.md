\🚀 Production-Grade DevSecOps Project: NextUnitech AI Platform<p align="center"><img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" /><img src="https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue?style=flat-square" /><img src="https://img.shields.io/badge/Architecture-Production%20Grade-orange?style=flat-square" /><img src="https://img.shields.io/badge/Infrastructure-Terraform%20%2B%20AWS-yellow?style=flat-square" /><img src="https://img.shields.io/badge/Kubernetes-Multi--Node%20Cluster-326ce5?style=flat-square&logo=kubernetes&logoColor=white" /><img src="https://img.shields.io/badge/CI--CD-Jenkins-red?style=flat-square&logo=jenkins&logoColor=white" /><img src="https://img.shields.io/badge/Security-Gitleaks%20%2F%20Trivy%20%2F%20SonarQube-orange?style=flat-square" /><img src="https://img.shields.io/badge/GitOps-ArgoCD-0aaaff?style=flat-square&logo=argo&logoColor=white" /><img src="https://img.shields.io/badge/Monitoring-Prometheus%20%2B%20Grafana-yellow?style=flat-square&logo=grafana&logoColor=white" /><img src="https://img.shields.io/badge/Stack-Fullstack%20App-green?style=flat-square" /></p>📋 Executive SummaryThis repository serves as a comprehensive blueprint for a modern, production-grade DevSecOps ecosystem. It demonstrates the end-to-end lifecycle of a full-stack AI application (React + FastAPI + MongoDB) deployed on a self-managed Kubernetes cluster on AWS.Beyond the application code, the primary focus of this project is the Platform Engineering architecture. It implements rigorous Infrastructure as Code (IaC) using Terraform, a secure CI/CD pipeline via Jenkins, GitOps delivery through ArgoCD, and enterprise-grade Observability with Prometheus and Grafana. Security is shifted left, with automated vulnerability scanning and secret detection integrated directly into the build process.📸 Application Preview🖥️ Frontend & Dashboard<p align="center"><img src="photos/web1.jpg" alt="Home UI Screenshot" width="48%">&nbsp; &nbsp;<img src="photos/web2.jpg" alt="Application Operational View" width="48%"></p><p align="center"><i><b>Left:</b> The landing page of the NextUnitech AI Platform. <b>Right:</b> The "About Us" operational view showcasing the leadership team.</i></p>⚙️ CI/CD & Operations<p align="center"><img src="photos/ci.jpg" alt="CI (Jenkins) Pipeline Screenshot" width="48%">&nbsp; &nbsp;<img src="photos/cd.jpg" alt="CD Pipeline Screenshot" width="48%"></p><p align="center"><i><b>Left:</b> Jenkins CI Pipeline executing Build, Test, and Scan stages. <b>Right:</b> CD Pipeline updating manifests.</i></p><p align="center"><img src="photos/agrocd.jpg" alt="ArgoCD Deployment View" width="48%">&nbsp; &nbsp;<img src="photos/grafana.jpg" alt="Monitoring Dashboard (Grafana)" width="48%"></p><p align="center"><i><b>Left:</b> ArgoCD synchronizing the application state. <b>Right:</b> Real-time cluster metrics in Grafana.</i></p>✨ Feature HighlightsInfrastructure as Code (IaC): Fully automated AWS environment provisioning (VPC, Security Groups, EC2, ALB, Route53) using Terraform.Container Orchestration: Self-managed Kubernetes cluster (1 Master, 2 Workers) bootstrapped via kubeadm.GitOps Delivery: Automated application synchronization and drift detection using ArgoCD.DevSecOps Integration:Trivy: Filesystem and container image vulnerability scanning.Gitleaks: Prevention of hardcoded secrets in the codebase.SonarQube: Static Application Security Testing (SAST) and code quality analysis.Secret Management: Secure injection of secrets using AWS Secrets Manager and the External Secrets Operator (ESO)—no secrets stored in Git.Observability: Full-stack monitoring with Prometheus (metrics collection) and Grafana (visualization).Secure Networking: End-to-end TLS encryption using AWS ACM and NGINX Ingress Controller.🏗️ System ArchitectureThe architecture ensures high availability and secure traffic flow from the user to the underlying microservices.Code snippetgraph TD
    User[User / Client] -->|HTTPS/443| Route53[AWS Route53]
    Route53 -->|Alias| ALB[AWS Application Load Balancer]
    ALB -->|Forward Traffic| TG[Target Group (NodePort 30080)]
    
    subgraph "AWS Cloud (ap-south-1)"
        subgraph "Kubernetes Cluster (EC2 Instances)"
            Ingress[NGINX Ingress Controller]
            
            TG -->|HTTP| Ingress
            
            Ingress -->|/| Front[Frontend Pod (React)]
            Ingress -->|/api| Back[Backend Pod (FastAPI)]
            
            Back -->|Read/Write| Mongo[MongoDB Pod]
            Back -->|Sync Secrets| ESO[External Secrets Operator]
        end
        
        ESO <-->|Fetch| ASM[AWS Secrets Manager]
    end
    
    Back -->|AI Query| OpenAI[OpenAI API]
🛡️ DevSecOps Pipeline ArchitectureOur pipeline enforces quality and security checks before any code reaches production.Code snippetgraph LR
    Dev[Developer] -->|Push Code| Git[GitHub Repo]
    
    subgraph "Continuous Integration (Jenkins)"
        Git -->|Webhook| Checkout
        Checkout -->|Test| UnitTests[Unit Tests (Jest/Pytest)]
        UnitTests -->|Scan| Security[Security Scan]
        
        subgraph "Security Stage"
            Security --> Trivy[Trivy FS Scan]
            Security --> Gitleaks[Gitleaks Secret Scan]
            Security --> Sonar[SonarQube Analysis]
        end
        
        Security -->|Build| Docker[Docker Build & Tag]
        Docker -->|Push| DockerHub[DockerHub Registry]
        Docker -->|Update Manifest| ManifestRepo[Update K8s Manifests]
    end
    
    subgraph "Continuous Delivery (GitOps)"
        ManifestRepo -->|Detect Change| ArgoCD
        ArgoCD -->|Sync State| K8s[Kubernetes Cluster]
    end
🧱 Technology StackDomainToolDescriptionCloud ProviderAWSEC2, VPC, Route53, ACM, Secrets Manager, IAMIaCTerraformAutomated infrastructure provisioning and state managementOrchestrationKubernetesSelf-managed cluster (v1.29) with kubeadmCI SystemJenkinsDeclarative pipelines with Docker agentsCD / GitOpsArgoCDDeclarative continuous delivery and state reconciliationSecurityTrivy, Gitleaks, SonarQubeVulnerability scanning, secret detection, code qualityMonitoringPrometheus, GrafanaMetrics scraping, alerting, and dashboard visualizationSecretsExternal Secrets OperatorSyncs AWS Secrets Manager secrets to K8s SecretsFrontendReact + ViteModern UI with TailwindCSS and Framer MotionBackendFastAPI (Python)High-performance async API with MongoDB integrationDatabaseMongoDBNoSQL database for chat history and user data🛠️ PrerequisitesBefore deploying, ensure you have the following:AWS Account: Admin access keys configured locally (~/.aws/credentials).Domain Name: Managed via Route53 (required for SSL/Ingress).OpenAI API Key: For the chatbot functionality.DockerHub Account: For storing container images.Tools Installed:Terraform (v1.5+)AWS CLI (v2)kubectlDocker Desktop💻 Local SetupYou can run the full application stack locally using Docker Compose to verify functionality before deploying to the cloud.1. Clone the RepositoryBashgit clone https://github.com/aditya6543/nextunitech.git
cd nextunitech
2. Configure Environment VariablesCreate .env files for backend and frontend based on the examples provided (.env.example).3. Run Security Scans (Optional)Ensure your code is secure before building.Gitleaks (Secret Detection):Bashdocker run -v $(pwd):/path zricethezav/gitleaks:latest detect --source="/path" -v
Trivy (Vulnerability Scan):Bashtrivy fs .
4. Run the ApplicationBashdocker-compose up --build
Frontend: http://localhost:3000Backend Docs: http://localhost:8000/docsMongoDB: mongodb://localhost:27017☁️ AWS Infrastructure DeploymentWe use Terraform to provision a custom VPC, Security Groups, and EC2 instances required for the Kubernetes cluster.1. Initialize TerraformNavigate to the infrastructure directory:Bashcd Infrastructure/terraform
terraform init
2. Review the PlanCheck the resources that will be created (VPC, Subnets, 3 EC2 instances, ALB, etc.):Bashterraform plan
3. Apply ConfigurationProvision the infrastructure. This may take 5–10 minutes.Bashterraform apply --auto-approve
Note: This creates 3 EC2 instances: k8s-node-1 (Master), k8s-node-2 (Worker), and k8s-node-3 (Worker).☸️ Kubernetes Bootstrap GuideOnce the EC2 instances are running, we must bootstrap the Kubernetes cluster manually or via the provided scripts.1. Configure Master NodeSSH into the Master Node (k8s-node-1) and run the bootstrap scripts located in Infrastructure/scripts/:Bash# 1. Configure networking modules
./bridgedtraffic.sh

# 2. Install Containerd Runtime
./containerruntime.sh

# 3. Install Kubeadm, Kubelet, Kubectl
./inskubeadm.sh

# 4. Initialize Cluster
sudo kubeadm init --pod-network-cidr=192.168.0.0/16 --node-name master
2. Configure Networking (Calico)Apply the Calico CNI manifest to enable pod communication:Bashkubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml
3. Join Worker NodesRun the kubeadm join command (output from the master init step) on both worker nodes.4. Setup Ingress ControllerDeploy the NGINX Ingress Controller to handle external traffic from the ALB:Bashkubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/baremetal/deploy.yaml
🔐 Secrets ManagementWe use External Secrets Operator (ESO) to securely sync secrets from AWS Secrets Manager to Kubernetes.Create Secret in AWS:Create a secret named myapp/production/config in AWS Secrets Manager with keys:MONGODB_URIOPENAI_API_KEYSESSION_SECRETInstall ESO via Helm:Bashhelm repo add external-secrets https://charts.external-secrets.io
helm install external-secrets external-secrets/external-secrets -n external-secrets --create-namespace
Apply Secret Manifests:Bashkubectl apply -f deploy/k8s/secretstore.yaml
kubectl apply -f deploy/k8s/externalsecret.yaml
🔄 CI/CD PipelineThe project uses a split-pipeline approach for maximum control.Continuous Integration (Jenkins)The Jenkinsfile.ci defines the build pipeline:Checkout: Pulls code from the repository.Security Scan: Runs gitleaks and trivy to check for secrets and vulnerabilities.Build & Push: Builds Docker images for Frontend and Backend, tagged with the Git commit hash, and pushes them to DockerHub.Continuous Delivery (ArgoCD)The Jenkinsfile.cd handles the manifest updates:Updates deploy/k8s/backend.yaml and deploy/k8s/frontend.yaml with the new image tags.Commits and pushes changes to the repository.ArgoCD detects the change and automatically syncs the cluster.ArgoCD Screenshot:📊 Monitoring & ObservabilityWe utilize the Kube-Prometheus Stack for comprehensive monitoring.1. InstallationBashhelm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
2. Access GrafanaPort-forward the Grafana service to access the dashboard locally:Bashkubectl port-forward svc/prometheus-grafana 3000:80 -n monitoring
URL: http://localhost:3000Default Creds: admin / prom-operatorGrafana Dashboard:🩺 Validation & TroubleshootingIssuePossible CauseSolutionPods PendingCNI not installed or Nodes not readyCheck kubectl get nodes and ensure Calico is applied.Ingress 404Ingress Controller not runningVerify ingress-nginx namespace pods are running.Secret MissingESO permission issueCheck ServiceAccount IAM role for Secrets Manager access.Jenkins Build FailDocker permission deniedEnsure Jenkins user is added to the docker group.ArgoCD OutOfSyncGit credentials incorrectUpdate ArgoCD repository settings with valid token.🧹 Cleanup Guide⚠️ COST WARNING: Running 3 EC2 instances and an Application Load Balancer (ALB) on AWS incurs hourly costs. Please destroy resources when not in use.To tear down the infrastructure:Bashcd Infrastructure/terraform
terraform destroy --auto-approve
Verify in the AWS Console that all EC2 instances, Load Balancers, and Target Groups have been terminated.🛣️ Roadmap[ ] Implementation of Istio Service Mesh for mTLS and advanced traffic splitting.[ ] High Availability (HA) setup for the Kubernetes Control Plane.[ ] Integration of ELK Stack (Elasticsearch, Logstash, Kibana) for centralized logging.[ ] Chaos Engineering testing using LitmusChaos.🤝 Contribution GuidelinesContributions are welcome! To contribute:Fork the repository.Create a Feature Branch (git checkout -b feature/AmazingFeature).Commit your changes (git commit -m 'Add some AmazingFeature').Push to the branch (git push origin feature/AmazingFeature).Open a Pull Request.⚖️ LicenseThis project is protected by the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).✅ You are free to: Share, copy, and adapt the material for personal learning and portfolio use.❌ You may NOT: Use this material for commercial purposes, including paid courses, SaaS products, or monetized hosting.ℹ️ Attribution: You must give appropriate credit to the original author (Aditya Kapse).🌟 Call to ActionIf you found this project helpful for your DevOps journey:⭐ Star this repository on GitHub!🔗 Connect with me on LinkedIn.🍴 Fork it and deploy your own version to learn by doing.<p align="center"><i>Built with ❤️ by Aditya Kapse</i></p>