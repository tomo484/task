```mermaid
graph TD
    %% --- 1. ユーザーアクセスとフロントエンド ---
    subgraph 1. ユーザーアクセス (Frontend & Auth)
        Client[👨‍💻 社員 (ブラウザ)] --> Route53[Route 53 (DNS)]
        Route53 --> CloudFront[CloudFront (CDN)]
        CloudFront -- 認証リクエスト --> Cognito[Cognito (認証・認可)]
        CloudFront -- 静的UI (HTML/CSS) --> S3_Static[S3 (Static UI)]
    end

    %% --- 2. データ取り込みワークフロー (Ingest) ---
    subgraph 2. データ取り込み (Ingest Flow)
        Client -- 1. 資料アップロード --> S3_Upload[S3 (Upload Bucket)]
        S3_Upload -- 2. トリガー --> Lambda_Ingest[Lambda (Ingest)]
        Lambda_Ingest -- 3. Embedding生成 --> Bedrock
        Lambda_Ingest -- 4. ベクトル登録 --> OpenSearch_Vector[OpenSearch (Vector DB)]
        Lambda_Ingest -- 4. メタデータ登録 --> Aurora_RDB[Aurora (RDB) <br> チケット/メタデータ/辞書]
    end

    %% --- 3. メインバックエンド (RAG & チケット管理) ---
    subgraph 3. メインバックエンド (RAG & Tickets)
        CloudFront -- APIリクエスト (チャット/起票) --> APIGateway[API Gateway]
        APIGateway --> ALB[Application Load Balancer]

        subgraph VPC (プライベートネットワーク)
            ALB --> ECS_Fargate[ECS (Fargate) <br> バックエンドAP (RAG/チケット)]
            ECR[ECR (コンテナイメージ)] --> ECS_Fargate

            %% RAG (検索) フロー
            ECS_Fargate -- RAG検索 --> OpenSearch_Vector
            ECS_Fargate -- メタデータ・辞書参照 --> Aurora_RDB
            ECS_Fargate -- 回答・比較表生成 --> Bedrock[Amazon Bedrock]

            %% チケット管理フロー
            ECS_Fargate -- チケット起票/更新 --> Aurora_RDB
            ECS_Fargate -- 通知発行 --> SNS[SNS (通知サービス)]
        end
    end

    %% --- 4. 通知ワークフロー ---
    subgraph 4. 通知フロー (Notification)
        SNS -- トリガー --> Lambda_Notify[Lambda (Notify)]
        Lambda_Notify -- 通知送信 --> Notify_Dest[Email / Slack]
    end

    %% --- 5. 運用基盤 (監視) ---
    subgraph 5. 運用基盤 (Monitoring)
        direction LR %% 監視は横並びで表示
        CloudWatch[CloudWatch (Logs/Metrics)]
        ECS_Fargate --> CloudWatch
        Lambda_Ingest --> CloudWatch
        Aurora_RDB --> CloudWatch
        ALB --> CloudWatch
    end
