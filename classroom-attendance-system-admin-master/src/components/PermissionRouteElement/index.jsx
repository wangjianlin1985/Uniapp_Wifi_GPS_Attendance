import React from 'react';
import { connect } from 'react-redux'
import { Navigate } from 'react-router-dom';

function PermissionRouteElement(props) {
  return props.isLogin ? props.element : <Navigate to={'/login'}/>
}

export default connect((state)=>({isLogin:state.userReducer.isLogin}))(PermissionRouteElement);
