// Type definitions for windows-elevate 1.0
// Project: https://github.com/ChristopherHaws/node-windows-elevate/
// Definitions by: Zlatko Andonovski <https://github.com/Goldsmith42>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

import { ChildProcess, ExecFileException, SpawnOptions } from 'child_process';


/**
 * Options for Command-Line UAC Elevation Utility.
 */
export type WindowsElevateOptions = {
    /**
     * Waits for termination; equivalent to "start /wait command".
     * @default true
     */
    wait: boolean, 
    /**
     * Whether to run persistent cmd.exe (/c), terminating (/k) cmd.exe, or do not use it at all (false). 
     * @default 'terminating'
     */
    cmd: 'terminating'|'persistent'|false,
    /**
     * Working directory. specify undefined to use parent process cwd, false (can used only with cmd !== false!!!) to not pushd cwd into cmd.exe.
     * @default 'undefined'
     */
    cwd: string | undefined | false,
    /**
     * When cmd !== false, use Unicode; equivalent to "cmd /u".
     * @default false
     */
    unicode: boolean, 
}

/**
 * Execute a command or run an executeable with elevated privileges.
 * @param cmd Command to execute.
 * @param options Arguments for command.
 * @param callback ChildProcess callback function.
 * @param elevateOptions Options for Command-Line UAC Elevation Utility.
 * @returns ChildProcess
 */
export function exec(cmd: string, options?: string | ReadonlyArray<string> | null, 
    callback?: (error: ExecFileException, stdout: string, stderr: string) => void, elevateOptions?: WindowsElevateOptions): ChildProcess;

/**
 * 
 * Spawns a new process with elevated privileges.
 * @param cmd Command to execute.
 * @param args Arguments for command. 
 * @param spawnOptions ChildProcess spawn options.
 * @param elevateOptions Options for Command-Line UAC Elevation Utility.
 * @returns ChildProcess
 */
export function spawn(cmd: string, args?: ReadonlyArray<string> | undefined, 
    spawnOptions?: SpawnOptions | undefined, elevateOptions?: WindowsElevateOptions | undefined): ChildProcess;


/**
 * Execute a command or runs an executeable with elevated privileges.
 * @param cmd Command to execute.
 * @param options Arguments for command.
 * @param elevateOptions Options for Command-Line UAC Elevation Utility.
 */
export function execPromise(cmd: string, options?: string | ReadonlyArray<string> | null, 
    elevateOptions?: WindowsElevateOptions): Promise<{ stdout: string, stderr: string }>;