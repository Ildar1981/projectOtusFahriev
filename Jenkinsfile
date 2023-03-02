pipeline {
    agent {
        docker { 
            image 'mcr.microsoft.com/playwright:v1.31.0-focal' 
            args '-u root'
        }
    }
    environment {
        TG_TOKEN = '5123724065:AAGHlvxmC68yGHeBSf7l61aNDuMq51igR7E'
        CHAT_ID = '-705242438'
    }
    stages {
      stage('e2e-tests') {
        steps {
            sh 'npm install'
            sh 'npx playwright install chrome'
            sh 'npx playwright test core'
        }
        post {
            always {
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: false, reportDir: 'playwright-report', reportFiles: 'index.html', reportName: 'HTML Report', reportTitles: 'Report'])
            }
        }
      }
    }
    
}