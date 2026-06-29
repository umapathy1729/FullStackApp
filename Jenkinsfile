pipeline {
    agent any

    environment {
        SONAR_PROJECT_KEY  = 'FullStackApp'
        SONAR_PROJECT_NAME = 'FullStackApp'
        SONAR_SERVER_NAME  = 'SonarQube'
        AWS_REGION         = 'ap-south-1'
        AWS_ACCOUNT_ID     = '145736415520'
        ECR_BACKEND        = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fullstack-backend"
        ECR_FRONTEND       = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/fullstack-frontend"
    }

    tools {
        nodejs 'NodeJS-18'
    }

    stages {

        stage('Git Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/umapathy1729/FullStackApp.git'
            }
        }

        stage('Backend - Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend - Install') {
            steps {
                dir('frontend/frontendapp') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('frontend/frontendapp') {
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONAR_SERVER_NAME}") {
                    sh """
                        npx sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.projectName=${SONAR_PROJECT_NAME} \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=**/node_modules/**,**/build/**,**/dist/**,**/*.test.js
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t ${ECR_BACKEND}:latest ./backend'
                sh 'docker build -t ${ECR_FRONTEND}:latest ./frontend/frontendapp'
            }
        }

        stage('Push to ECR') {
            steps {
                withCredentials([aws(
                    credentialsId: 'aws-credentials',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS --password-stdin \
                        ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        docker push ${ECR_BACKEND}:latest
                        docker push ${ECR_FRONTEND}:latest
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([aws(
                    credentialsId: 'aws-credentials',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                )]) {
                    sh """
                        aws eks update-kubeconfig --region ${AWS_REGION} --name fullstack-cluster
                        kubectl apply -f k8s/backend-deployment.yml
                        kubectl apply -f k8s/backend-service.yml
                        kubectl apply -f k8s/frontend-deployment.yml
                        kubectl apply -f k8s/frontend-service.yml
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Build Successful!"
        }
        failure {
            echo "Build Failed. Check logs above."
        }
        always {
            cleanWs()
        }
    }
}
