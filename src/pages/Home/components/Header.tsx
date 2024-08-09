/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import styled from 'styled-components'
import LogoSvg from '../../../../public/AqConnectaIcon.svg'

const Container = styled.div`
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 0px 24px;
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 10;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  height: 100%; 
  padding: 8px 32px;
  max-width: 1128px;
`

const Logo = styled.span`
  margin-right: 8px;
  font-size: 0;
`

const Search = styled.div`
  opacity: 1;
  flex-grow: 1;
  position: relative;
  @media (max-width: 768px) {
    flex-grow: unset;
  }
  & > div {
    max-width: 280px;
    input {
      border: none;
      box-shadow: none;
      background-color: #eef3f8;
      border-radius: 2px;
      color: rgba(0, 0, 0, 0.9);
      width: 218px;
      padding: 0 8px 0 40px;
      line-height: 1.75;
      font-weight: 400;
      font-size: 14px;
      height: 34px;
      vertical-align: text-top;
      border-color: #dce6f1;
      @media (max-width: 768px) {
        width: 140px;
      }
    }
  }
`

const SearchIcon = styled.div`
  width: 40px;
  z-index: 1;
  position: absolute;
  top: 10px;
  left: 5px;
  border-radius: 0 2px 2px 0;
  margin: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

function Header() {
  return (
    <Container>
      <Content>
        <Logo>
          <a href="/home" alt="link">
            <img src={LogoSvg} alt="" width="24px" height="24px" />
          </a>
        </Logo>
        <Search>
          <div>
            <input type="text" placeholder="Search" />
          </div>
          <SearchIcon>
            <img src="/images/search-icon.svg" alt="" />
          </SearchIcon>
        </Search>
      </Content>
    </Container>
  )
}

export default Header
