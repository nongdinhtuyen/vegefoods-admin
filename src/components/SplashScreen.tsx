import React from 'react';
import styled from 'styled-components';

const Screen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  svg {
    width: 4.75em;
    transform-origin: center;
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: #1890ff;
    stroke-width: 2;
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 200;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 200;
      stroke-dashoffset: -35px;
    }
    100% {
      stroke-dashoffset: -125px;
    }
  }
`;

export default function LoadingInit() {
  return (
    <Screen>
      <svg viewBox='25 25 50 50'>
        <circle cx='50' cy='50' r='20'></circle>
      </svg>
    </Screen>
  );
}
