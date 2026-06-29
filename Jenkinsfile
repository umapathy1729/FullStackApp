
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
    }
}
