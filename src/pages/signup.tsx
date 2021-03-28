import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Header from '@components/Header';
import { Input, InputLabel, InputWrap } from '@components/styles/inputs';
import { SignupSheet } from '@components/styles/sheets';
import { Button } from '@components/styles/buttons';
import { IntegrationButton } from '@components/styles/integrations';
import { ButtonHint, Title } from '@components/styles/titles';

const SignupWith = styled(ButtonHint)`
    margin: 25px 0 25px 0;
`;

const Spacer = styled.div`
    margin: 0 20px;
`;

const Signup = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted!');
    };

    return (
        <>
            <Header />

            <SignupSheet onSubmit={handleSubmit} noValidate={true}>
                <Title>Signup</Title>

                <InputWrap>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input
                        name="username"
                        id="username"
                        type="text"
                        placeholder="JohnDoe"
                    />
                    <InputLabel htmlFor="email">E-mail</InputLabel>
                    <Input
                        name="email"
                        id="email"
                        type="text"
                        placeholder="john@email.com"
                    />
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        name="password"
                        id="password"
                        type="password"
                        placeholder="********"
                    />
                    <InputLabel htmlFor="confirmPassword">
                        Confirm password
                    </InputLabel>
                    <Input
                        name="confirmPassword"
                        id="confirmPassword"
                        type="password"
                        placeholder="********"
                    />

                    <Button>Signup</Button>
                    <ButtonHint className="mt-2">
                        Already have an account?{' '}
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                    </ButtonHint>
                    <SignupWith>or signup with</SignupWith>
                    <div className="d-flex justify-content-center">
                        <IntegrationButton href="#">
                            <img
                                width={32}
                                src="/icons/google.png"
                                alt="Register with GitHub"
                            />
                        </IntegrationButton>
                        <Spacer />
                        <IntegrationButton href="#">
                            <img
                                width={32}
                                src="/icons/github.png"
                                alt="Register with Google"
                            />
                        </IntegrationButton>
                    </div>
                </InputWrap>
            </SignupSheet>
        </>
    );
};

export default Signup;
