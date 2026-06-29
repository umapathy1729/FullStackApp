pipeline {
    agent any

    environment {
        SONAR_PROJECT_KEY  = 'FullStackApp'
        SONAR_PROJECT_NAME = 'FullStackApp'
        SONAR_SERVER_NAME  = 'SonarQube'
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
                          -Dsonar.exclusions=**/node_modules/**,**/build/**,**/dist/**,**/*.test.js \
                          -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info,frontend/frontendapp/coverage/lcov.info
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'frontend/frontendapp/build/**', allowEmptyArchive: true
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
