
local:
	docker run -p 8000:8000 amazon/dynamodb-local

seed:
	aws dynamodb create-table \
		--table-name Music \
		--attribute-definitions \
			AttributeName=Artist,AttributeType=S \
			AttributeName=SongTitle,AttributeType=S \
		--key-schema \
			AttributeName=Artist,KeyType=HASH \
			AttributeName=SongTitle,KeyType=RANGE \
		--provisioned-throughput \
			ReadCapacityUnits=10,WriteCapacityUnits=5 \
		--profile=local
