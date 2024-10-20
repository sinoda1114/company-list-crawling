import React, { useState } from 'react';
import { Search } from 'lucide-react';

const API_KEY = '1d860747cbadc8a9fe45ae4535d019d9';

interface DomainInfo {
  domainName: string;
  creationDate: string;
  registrarName: string;
  contactEmail: string;
}

function App() {
  const [domains, setDomains] = useState<DomainInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDomains = async () => {
    setLoading(true);
    setError(null);
    try {
      const domainName = 'example.com'; // テスト用のドメイン名
      const apiUrl = `/api/whoisdata?apiKey=${API_KEY}&domainName=${domainName}&outputFormat=JSON`;
      
      console.log('Calling API:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      const responseText = await response.text();
      console.log('API Response:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = JSON.parse(responseText);
      
      // Process the data and update the state
      const domainInfo: DomainInfo = {
        domainName: data.WhoisRecord.domainName,
        creationDate: data.WhoisRecord.createdDate,
        registrarName: data.WhoisRecord.registrarName,
        contactEmail: data.WhoisRecord.contactEmail,
      };
      
      setDomains([domainInfo]);
    } catch (err) {
      console.error('API Error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          setError('ネットワークエラー: APIサーバーに接続できません。インターネット接続を確認してください。');
        } else if (err.message.includes('status: 401')) {
          setError('認証エラー: API キーが無効か、アクセス権限がありません。API キーを確認してください。');
        } else if (err.message.includes('status: 500')) {
          setError('サーバーエラー: APIサーバーで問題が発生しました。しばらく待ってから再試行してください。');
        } else {
          setError(`API呼び出し中にエラーが発生しました: ${err.message}`);
        }
      } else {
        setError('予期せぬエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  // ... (残りのコンポーネントコードは変更なし)
}

export default App;