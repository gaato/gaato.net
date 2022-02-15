import subprocess

from rest_framework.views import APIView, status
from rest_framework.response import Response

from .serializers import TexSerializer


class TexView(APIView):
    def post(self, request):
        serializer = TexSerializer(data=request.data)
        if serializer.is_valid():
            match serializer.data['type']:
                case 'pdf':
                    r = subprocess.run(
                        ['sudo', 'docker', 'run', '--rm', '-i', 'tex', 'texpdf.py', '-p'],
                        input=serializer.data['code'],
                        stdout=subprocess.PIPE,
                        text=True,
                    )
                case 'png':
                    if serializer.data.get('plain', False):
                        r = subprocess.run(
                            ['sudo', 'docker', 'run', '--rm', '-i', 'tex', 'tex.py', '-p'],
                            input=serializer.data['code'],
                            stdout=subprocess.PIPE,
                            text=True,
                        )
                    else:
                        r = subprocess.run(
                            ['sudo', 'docker', 'run', '--rm', '-i', 'tex', 'tex.py'],
                            input=serializer.data['code'],
                            stdout=subprocess.PIPE,
                            text=True,
                        )
                case _:
                    return Response(None, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            match r.returncode:
                case 0:
                    result = {
                        'status': 0,
                        'result': r.stdout,
                    }
                case 1:
                    result = {
                        'status': 1,
                        'error': r.stdout,
                    }
                case 2:
                    result = {
                        'status': 2,
                        'error': 'timeout',
                    }
                case _:
                    return Response(None, 500)
            return Response(result)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

