@rem ==		1. 빌드된 jar파일을 서버에 전송
scp -i "c:\keyfile\gw.pem" -r ./build/libs/gateway*.jar ubuntu@ec2-13-209-214-32.ap-northeast-2.compute.amazonaws.com:/home/ubuntu/app/gateway
@rem ==		2. jar 파일을 실행하는 run.sh 스크립트 파일을 서버에 전송 
scp -i "c:\keyfile\gw.pem" -r ./run.sh ubuntu@ec2-13-209-214-32.ap-northeast-2.compute.amazonaws.com:/home/ubuntu/app/gateway
@rem ==		3. run.sh 스크립트 파일을 실행가능하도록 권한 부여(777 -> rwx rwx rwx)
ssh -i "c:\keyfile\gw.pem" ubuntu@ec2-13-209-214-32.ap-northeast-2.compute.amazonaws.com "sudo chmod 777 /home/ubuntu/app/gateway/run.sh"
@rem ==		4. run.sh 스크립트 파일을 실행가능하도록 권한 부여(777 -> rwx rwx rwx)
ssh -i "c:\keyfile\gw.pem" ubuntu@ec2-13-209-214-32.ap-northeast-2.compute.amazonaws.com "cd /home/ubuntu/app/gateway; ./run.sh gateway"
@rem 다른 프로젝트 수행 시 /home/ubuntu/app/myworkspace ,  ./run.sh myworkspace 경로 수정하시오

@rem scp -i "c:\keyfile\myworkspace.pem" -r ./build/libs/*.jar ubuntu@ec2-52-78-190-195.ap-northeast-2.compute.amazonaws.com:{수정할부분}
@rem scp -i "c:\keyfile\myworkspace.pem" -r ./run.sh ubuntu@ec2-52-78-190-195.ap-northeast-2.compute.amazonaws.com:{수정할부분}
@rem ssh -i "c:\keyfile\myworkspace.pem" ubuntu@ec2-52-78-190-195.ap-northeast-2.compute.amazonaws.com "sudo chmod 777 {수정할부분}/run.sh"
@rem ssh -i "c:\keyfile\myworkspace.pem" ubuntu@ec2-52-78-190-195.ap-northeast-2.compute.amazonaws.com "cd {수정할부분}; ./run.sh {수정할부분}"

@rem 사전에 mkdir home/ubuntu/app/ 프로젝트명 디렉토리 만들어야 함
@rem 키파일 "c:\keyfile\myworkspace.pem"은 그대로 두고 그 외 프로젝트명으로 바꿈
@rem 
@rem 