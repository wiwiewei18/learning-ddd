 //below script is for Slack Notification, the script untested yet
def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]

def build_url = "${env.JENKINS_URL}blue/organizations/jenkins/Smart-Apes%2F${env.JOB_BASE_NAME}/detail/${env.JOB_BASE_NAME}/${env.BUILD_NUMBER}/pipeline"

def web_url_Sandbox = "https://sandbox.smartapes.sg"
def web_url_Stage = "https://stage.smartapes.sg"

//Production Server
//def remoteLive = [:]
//remoteLive.name = "128.199.245.111"
//remoteLive.host = "128.199.245.111"
//remoteLive.allowAnyHosts = true

//def remoteStage = [:]
//remoteStage.name = "128.199.245.111"
//remoteStage.host = "128.199.245.111"
//remoteStage.allowAnyHosts = true

//def remotesandbox = [:]
//remotesandbox.name = "128.199.202.236"
//remotesandbox.host = "128.199.202.236"
//remotesandbox.allowAnyHosts = true

def verRegexs = ".*?(<<.*>>)-([^.]+).*" 

pipeline {
    agent {
        node{
            label 'Jenkins-Node-1'
        }
    } 
    parameters {
        /*string(name: 'buildEnv', defaultValue: 'staging')*/
        string(name: 'buildEnv', defaultValue: 'staging')
        string(name: 'pr_title', defaultValue: 'Example: <<1.0.73-B2B>>-development')
        string(name: 'release_version', defaultValue: 'example: backend-0.0.0-beta')
        string(name: 'release_timer', defaultValue: 'example: true or false')
        string(name: 'release_at', defaultValue: 'example: 2300 (on GTM+8)')
        string(name: 'test_release', defaultValue: 'example: true or false')
        string(name: 'module', defaultValue: '')
    }
    triggers {
       GenericTrigger(
            genericVariables: [
                 //[key: 'pr_title', value:'$.pr_title'], 
                 [key: 'pr_title', value:'$.pullrequest.title']
            ],
            genericRequestVariables: [
                 [key: 'buildEnv', regexpFilter: ''],
                 [key: 'release_version', regexpFilter: ''],
                 [key: 'project_id', regexpFilter: ''],
                 [key: 'release_id', regexpFilter: ''],
            ],
            // printContributedVariables: true,
            token: 'L0NY5198ND3NR05FQ726OMUBONRKO',
            // causeString: 'Release from JIRA',
        )
    } 
    environment {
        DEPLOY = "$buildEnv"
        TEMP = "$pr_title".replaceAll(verRegexs, '$1')
        TEMP2 = "$env.TEMP".replaceAll("<", "").replaceAll(">", "")
        TARGET = "$pr_title".replaceAll(verRegexs, '$2')
        SERVER = "${env.DEPLOY == "staging" && env.TARGET == "development" ? "STAGING" : env.DEPLOY == "staging" && env.TARGET == "sandbox" ? "SANDBOX" : "LIVE"}".trim()
        VERSION = "${env.DEPLOY == "staging" ? "$env.TEMP2" : "$release_version"}".trim()        
        BRANCH = "${env.DEPLOY == "staging" && env.TARGET == "development" ? "development" : env.DEPLOY == "staging" && env.TARGET == "sandbox" ? "sandbox" : "production"}".trim()
        PROJECTID = "$project_id"
        RELEASEID = "$release_id"
    }
    stages {
        stage ('Checkout Repo Master') {
        //please setup git repo and credential on pipeline config
        //checkout scm
            steps {
                catchError {
                    // checkout scm
                    checkout([
                    $class: 'GitSCM', branches: [[name: "*/${env.BRANCH}"]],
                    userRemoteConfigs: [[url: 'https://dikakurnia07@bitbucket.org/grip-batam/smartapes-backend-ts.git',credentialsId:'b1f6cdf9-1b68-40bf-8860-066c7ab6a399']]
                    ])
                }
            }
        }
        
        stage ('Prepare') {
            steps {
                catchError {
                    script {
                        if(env.VERSION != 'no-build'){
                            if (env.DEPLOY == 'staging' && env.TARGET == "development"){
                                sh 'yarn install'
                                echo "Preparation Done"
                            }
                            else {
                                echo "Error" //test
                            }
                        }
                    }
                }
            }
        }

        stage ('Test Unit') {
            steps {
                catchError {
                    script {
                        if(env.VERSION != 'no-build'){
                            if (env.DEPLOY == 'staging' && env.TARGET == "development"){
                                sh 'yarn test:unit'
                                echo "Unit Test Done"
                            }
                            else {
                                echo "Error" //test
                            }
                        }
                    }
                }
            }
        }
    }
    post {
        success {            
            script {                                                
                if(env.VERSION != 'no-build'){
                    echo "Jenkins stages Done"
                    }
                }
            }
        failure {            
            script {                                                
                if(env.VERSION != 'no-build'){
                    echo "Jenkins Failure"
                }
            }
        }
        aborted {            
            script {                                                
                if(env.VERSION != 'no-build'){
                    echo "Jenkins Aborted"
                }
            }
        }
    } 
}