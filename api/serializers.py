from rest_framework import serializers


class TexSerializer(serializers.Serializer):
    
    type = serializers.ChoiceField([('pdf', 'pdf'), ('png', 'png')])
    plain = serializers.NullBooleanField(required=False)
    code = serializers.CharField(allow_blank=True)

    def validate(self, data):
        if data['type'] == 'pdf' and data.get('plain') is False:
            raise serializers.ValidationError(
                'plain field must not be false if type is pdf'
            )
        return data
