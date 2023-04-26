import { Button, Layout, Result } from 'antd';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePageTitle } from '../../utils/utils';

const { Header, Content } = Layout

function NotFound() {
  const navigate = useNavigate()
  const onBackClick = useCallback(()=>{
    navigate(-1)
  })
  useEffect(()=>{
    changePageTitle("404")
  },[])
  return (
    <Layout style={{height:'100vh'}}>
      <Header style={{backgroundColor:'#fff'}}>
        <div className="logo">课程考勤管理系统</div>
      </Header>
      <Content style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
        <Result status="404" title="404" subTitle="很抱歉，你访问的页面不存在" extra={<Button type='primary' onClick={onBackClick}>返回</Button>}/>
      </Content>
    </Layout>
  );
}

export default NotFound;
