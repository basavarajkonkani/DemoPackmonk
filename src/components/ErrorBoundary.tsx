import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <ErrorTitle>Oops! Something went wrong</ErrorTitle>
            <ErrorMessage>{this.state.error?.toString()}</ErrorMessage>
            <ErrorStack>
              {this.state.error?.stack}
            </ErrorStack>
            <ResetBtn onPress={() => this.setState({ hasError: false, error: null })}>
              <ResetBtnText>Try Again</ResetBtnText>
            </ResetBtn>
          </ScrollView>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

const ErrorContainer = styled.View`
  flex: 1;
  background-color: #fff;
  justify-content: center;
  padding: 20px;
`;

const ErrorTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 12px;
`;

const ErrorMessage = styled.Text`
  font-size: 14px;
  color: #374151;
  margin-bottom: 16px;
  line-height: 20px;
`;

const ErrorStack = styled.Text`
  font-size: 11px;
  color: #6b7280;
  font-family: monospace;
  background-color: #f3f4f6;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
`;

const ResetBtn = styled.TouchableOpacity`
  background-color: #3b82f6;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
`;

const ResetBtnText = styled.Text`
  color: #fff;
  font-weight: 600;
  font-size: 14px;
`;
