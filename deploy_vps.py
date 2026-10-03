import paramiko
import sys

hostname = '31.220.88.80'
port = 22
username = 'root'
password = 'Upt2026'

try:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print("Connecting to VPS...")
    client.connect(hostname, port, username, password)
    
    commands = [
        "if [ ! -d '/root/nannyapp' ]; then git clone https://github.com/UPT-FAING-EPIS/si784-2026-ii-si784-2026-ii-examen-u1-stevien04.git /root/nannyapp; fi",
        "cd /root/nannyapp && git pull origin main",
        "cd /root/nannyapp && docker build -t nannyapp:latest .",
        "docker stop nannyapp || true",
        "docker rm nannyapp || true",
        "docker run -d -p 82:8080 --name nannyapp nannyapp:latest"
    ]
    
    for cmd in commands:
        print(f"Executing: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd)
        exit_status = stdout.channel.recv_exit_status()
        print(stdout.read().decode())
        print(stderr.read().decode())
        if exit_status != 0:
            print(f"Command failed with status {exit_status}")

    client.close()
    print("Deployment successful!")
except Exception as e:
    print(f"Failed: {e}")
