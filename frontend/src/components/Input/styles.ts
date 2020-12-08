import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
  isHidden: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #fff;
  border-radius: 10px;
  padding: 0px 16px;
  width: 100%;

  border: 2px solid var(--color-input-border);
  color: #666360;

  display: flex;
  align-items: center;

  & + div {
    /* margin-top: 8px; */
    margin-top: 8px;
  }
  & + option {
    /* margin-top: 8px; */
    background: #fff;
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
      color: #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      border: 2px solid #ff9000;
      color: #ff9000;
    `}

    
  ${props =>
    props.isFilled &&
    css`
      color: #ff9000;
    `}

    ${props =>
      props.isHidden &&
      css`
        border: 0px solid #fff;
        background: #fff;
      `}


  input {
    flex: 1;
    border: 0;
    background: transparent;
    color: #f4ede8;
    height: 40px;
    line-height: 40px;
    

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
