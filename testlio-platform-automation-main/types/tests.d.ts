import { EnumRunTypes } from './enum';

export type PlatformType = 'Android' | 'macOS' | 'iOS' | 'Windows' | 'Web';

export interface IRegressionTest {
    title: string;
    platform: 'Android' | 'macOS' | 'iOS' | 'Windows' | 'Web';
    execution: number;
    automated: 'Yes' | 'No';
    step: string;
    expected: string;
}

export type RunType = keyof typeof EnumRunTypes;
