import { useState, useEffect, useRef } from 'react';
import './App.css';

const ReactDOS = () => {
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isBooting, setIsBooting] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [currentDir, setCurrentDir] = useState('C:\\');
  const outputRef = useRef<HTMLDivElement>(null);

  const fileSystem: Record<string, string[]> = {
    'C:\\': ['AUTOEXEC.BAT', 'CONFIG.SYS', 'COMMAND.COM', 'DOS', 'WINDOWS', 'TEMP', 'GAMES'],
    'C:\\DOS': ['FORMAT.COM', 'CHKDSK.EXE', 'EDIT.COM', 'DEBUG.EXE'],
    'C:\\WINDOWS': ['SYSTEM', 'WIN.INI', 'SYSTEM.INI', 'NOTEPAD.EXE'],
    'C:\\GAMES': ['DOOM.EXE', 'PRINCE.EXE', 'WOLFENSTEIN.EXE'],
    'C:\\TEMP': []
  };

  useEffect(() => {
    const bootSequence = async () => {
      await addLine('Starting MS-DOS...', 300);
      await addLine('', 100);
      await addLine('HIMEM is testing extended memory...done.', 200);
      await addLine('', 100);
      await addLine('ReactDOS Version 1.0', 200);
      await addLine('MIT License (C) 2025 ReactDOS Project', 200);
      await addLine('', 300);
      await addLine('═══════════════════════════════════════════════', 100);
      await addLine('         Welcome to ReactDOS v1.0', 100);
      await addLine('    A Retro DOS Simulator Built with React', 100);
      await addLine('═══════════════════════════════════════════════', 100);
      await addLine('', 200);
      await addLine('Type HELP for list of commands', 200);
      await addLine('', 100);
      setIsBooting(false);
    };

    bootSequence();

    const cursorInterval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      const element = outputRef.current as HTMLDivElement;
      element.scrollTop = element.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isBooting) return;

      if (e.key === 'Enter') {
        if (input.trim()) {
          executeCommand(input);
          setInput('');
        } else {
          addLine('', 0);
        }
      } else if (e.key === 'Backspace') {
        setInput(prev => prev.slice(0, -1));
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setInput(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [input, isBooting]);

  const addLine = (text: string, delay: number = 0): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        setOutput(prev => [...prev, text]);
        resolve();
      }, delay);
    });
  };

  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentDate = (): string => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const executeCommand = async (cmd: string): Promise<void> => {
    const command = cmd.trim();
    const parts = command.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    await addLine(`${currentDir}>${command}`, 0);

    if (mainCmd === 'help' || mainCmd === '?') {
      await addLine('', 50);
      await addLine('Available commands:', 100);
      await addLine('', 50);
      await addLine('DIR          - List directory contents', 50);
      await addLine('CD [dir]     - Change directory', 50);
      await addLine('TYPE [file]  - Display file contents', 50);
      await addLine('COPY [file]  - Copy files', 50);
      await addLine('DEL [file]   - Delete files', 50);
      await addLine('REN [file]   - Rename files', 50);
      await addLine('MD [dir]     - Make directory', 50);
      await addLine('RD [dir]     - Remove directory', 50);
      await addLine('CLS          - Clear screen', 50);
      await addLine('VER          - Display version', 50);
      await addLine('DATE         - Display/set date', 50);
      await addLine('TIME         - Display/set time', 50);
      await addLine('MEM          - Display memory usage', 50);
      await addLine('TREE         - Display directory tree', 50);
      await addLine('ATTRIB       - Display file attributes', 50);
      await addLine('FORMAT       - Format disk', 50);
      await addLine('CHKDSK       - Check disk', 50);
      await addLine('EDIT [file]  - Edit file', 50);
      await addLine('PRINT [file] - Print file', 50);
      await addLine('GITHUB       - View GitHub repository', 50);
      await addLine('INFO         - About ReactDOS', 50);
      await addLine('', 50);

    } else if (mainCmd === 'info') {
      await addLine('╔═══════════════════════════════════════════════╗', 50);
      await addLine('║           ReactDOS v1.0 Information           ║', 50);
      await addLine('╠═══════════════════════════════════════════════╣', 50);
      await addLine('║                                               ║', 50);
      await addLine('║  A retro DOS simulator built with React       ║', 50);
      await addLine('║  Simulates classic MS-DOS experience          ║', 50);
      await addLine('║                                               ║', 50);
      await addLine('║  Author: Anderbey                             ║', 50);
      await addLine('║  Technology: React + TypeScript               ║', 50);
      await addLine('║  Year: 2025                                   ║', 50);
      await addLine('║                                               ║', 50);
      await addLine('║  This is a visual simulation only.            ║', 50);
      await addLine('║  No actual file operations are performed.     ║', 50);
      await addLine('║                                               ║', 50);
      await addLine('╚═══════════════════════════════════════════════╝', 50);
      await addLine('', 50);

    } else if (mainCmd === 'dir') {
      await addLine('', 100);
      await addLine(` Volume in drive C is REACTDOS`, 100);
      await addLine(` Volume Serial Number is 1A2B-3C4D`, 100);
      await addLine('', 50);
      await addLine(` Directory of ${currentDir}`, 100);
      await addLine('', 50);

      const files = fileSystem[currentDir] || [];

      if (currentDir !== 'C:\\') {
        await addLine('.            <DIR>         ' + getCurrentDate() + '  ' + getCurrentTime(), 50);
        await addLine('..           <DIR>         ' + getCurrentDate() + '  ' + getCurrentTime(), 50);
      }

      for (const file of files) {
        const isDir = fileSystem[`${currentDir}${file}`] !== undefined;
        const size = isDir ? '<DIR>' : Math.floor(Math.random() * 50000 + 1000).toString().padStart(10);
        await addLine(`${file.padEnd(13)} ${size}  ${getCurrentDate()}  ${getCurrentTime()}`, 50);
      }

      await addLine('', 50);
      await addLine(`        ${files.length} File(s)     ${Math.floor(Math.random() * 100000)} bytes`, 100);
      await addLine(`                       12,345,678 bytes free`, 100);
      await addLine('', 50);

    } else if (mainCmd === 'cd') {
      if (args.length === 0) {
        await addLine(currentDir, 100);
        await addLine('', 50);
      } else if (args[0] === '..') {
        if (currentDir !== 'C:\\') {
          setCurrentDir('C:\\');
          await addLine('', 50);
        }
      } else {
        const newDir = `${currentDir}${args[0].toUpperCase()}`;
        if (fileSystem[newDir]) {
          setCurrentDir(newDir + '\\');
          await addLine('', 50);
        } else {
          await addLine('Invalid directory', 100);
          await addLine('', 50);
        }
      }

    } else if (mainCmd === 'cls') {
      setOutput([]);

    } else if (mainCmd === 'github') {
      await addLine('', 100);
      await addLine('  ╔════════════════════════════════════════════╗', 50);
      await addLine('  ║         ReactDOS on GitHub                 ║', 50);
      await addLine('  ╠════════════════════════════════════════════╣', 50);
      await addLine('  ║                                            ║', 50);
      await addLine('  ║  Repository:                               ║', 50);
      await addLine('  ║  https://github.com/Anderbey/ReactDOS      ║', 50);
      await addLine('  ║                                            ║', 50);
      await addLine('  ║     Star the project if you like it!       ║', 50);
      await addLine('  ║                                            ║', 50);
      await addLine('  ╚════════════════════════════════════════════╝', 50);
      await addLine('', 50);

    } else if (mainCmd === 'ver') {
      await addLine('', 100);
      await addLine('ReactDOS Version 1.0', 100);
      await addLine('', 50);

    } else if (mainCmd === 'date') {
      await addLine('', 100);
      await addLine(`Current date is: ${getCurrentDate()}`, 100);
      await addLine('', 50);

    } else if (mainCmd === 'time') {
      await addLine('', 100);
      await addLine(`Current time is: ${getCurrentTime()}`, 100);
      await addLine('', 50);

    } else if (mainCmd === 'mem') {
      await addLine('', 100);
      await addLine('Memory Type        Total       Used       Free', 100);
      await addLine('───────────────────────────────────────────────', 50);
      await addLine('Conventional        640K       256K       384K', 50);
      await addLine('Upper              384K        64K       320K', 50);
      await addLine('Reserved           384K       384K         0K', 50);
      await addLine('Extended (XMS)   15360K      2048K     13312K', 50);
      await addLine('───────────────────────────────────────────────', 50);
      await addLine('Total memory    16768K      2752K     14016K', 100);
      await addLine('', 50);

    } else if (mainCmd === 'tree') {
      await addLine('', 100);
      await addLine('Directory PATH listing', 100);
      await addLine('Volume serial number is 1A2B-3C4D', 100);
      await addLine('C:\\', 50);
      await addLine('├───DOS', 50);
      await addLine('├───WINDOWS', 50);
      await addLine('│   └───SYSTEM', 50);
      await addLine('├───GAMES', 50);
      await addLine('└───TEMP', 50);
      await addLine('', 50);

    } else if (mainCmd === 'type') {
      if (args.length === 0) {
        await addLine('Required parameter missing', 100);
      } else {
        await addLine('', 100);
        await addLine('REM Sample DOS Batch File', 50);
        await addLine('@ECHO OFF', 50);
        await addLine('ECHO Welcome to ReactDOS!', 50);
        await addLine('ECHO This is a simulated file.', 50);
        await addLine('PAUSE', 50);
        await addLine('', 50);
      }

    } else if (mainCmd === 'chkdsk') {
      await addLine('', 100);
      await addLine('Checking disk C:', 200);
      await addLine('', 300);
      for (let i = 0; i <= 100; i += 10) {
        await new Promise<void>(resolve => setTimeout(() => resolve(), 100));
        setOutput(prev => {
          const newOutput = [...prev];
          if (newOutput.length > 0) {
            newOutput[newOutput.length - 1] = `Checking file system... ${i}%`;
          }
          return newOutput;
        });
      }
      await addLine('', 100);
      await addLine('  16,777,216 bytes total disk space', 100);
      await addLine('   4,321,098 bytes in 3 hidden files', 100);
      await addLine('     524,288 bytes in 27 directories', 100);
      await addLine('   9,876,543 bytes in 156 user files', 100);
      await addLine('   2,055,287 bytes available on disk', 100);
      await addLine('', 100);
      await addLine('       2,048 bytes in each allocation unit', 100);
      await addLine('       8,192 total allocation units on disk', 100);
      await addLine('       1,003 available allocation units on disk', 100);
      await addLine('', 100);
      await addLine('     655,360 total bytes memory', 100);
      await addLine('     589,824 bytes free', 100);
      await addLine('', 50);

    } else if (mainCmd === 'format') {
      await addLine('', 100);
      await addLine('WARNING: ALL DATA ON NON-REMOVABLE DISK', 100);
      await addLine('DRIVE C: WILL BE LOST!', 100);
      await addLine('', 100);
      await addLine('This is a simulation - no actual formatting occurs.', 200);
      await addLine('', 50);

    } else if (mainCmd === 'attrib') {
      const files = fileSystem[currentDir] || [];
      await addLine('', 100);
      for (const file of files.slice(0, 5)) {
        const attrs = Math.random() > 0.5 ? 'A  R' : 'A   ';
        await addLine(`${attrs}  ${currentDir}${file}`, 50);
      }
      await addLine('', 50);

    } else if (mainCmd === 'copy') {
      if (args.length < 2) {
        await addLine('Required parameter missing', 100);
      } else {
        await addLine('', 100);
        await addLine(`        1 file(s) copied`, 200);
        await addLine('', 50);
      }

    } else if (mainCmd === 'del' || mainCmd === 'erase') {
      if (args.length === 0) {
        await addLine('Required parameter missing', 100);
      } else {
        await addLine('', 100);
        await addLine(`Deleted: ${args[0]}`, 200);
        await addLine('', 50);
      }

    } else if (mainCmd === 'ren' || mainCmd === 'rename') {
      if (args.length < 2) {
        await addLine('Required parameter missing', 100);
      } else {
        await addLine('', 100);
        await addLine(`Renamed: ${args[0]} to ${args[1]}`, 200);
        await addLine('', 50);
      }

    } else if (mainCmd === 'md' || mainCmd === 'mkdir') {
      if (args.length === 0) {
        await addLine('Required parameter missing', 100);
      } else {
        await addLine('', 100);
        await addLine(`Directory created: ${args[0]}`, 200);
        await addLine('', 50);
      }

    } else if (mainCmd === 'rd' || mainCmd === 'rmdir') {
      if (args.length === 0) {
        await addLine('Required parameter missing', 100);
      } else {
        await addLine('', 100);
        await addLine(`Directory removed: ${args[0]}`, 200);
        await addLine('', 50);
      }

    } else if (mainCmd === 'edit') {
      await addLine('', 100);
      await addLine('Starting MS-DOS Editor...', 200);
      await addLine('(Editor simulation - not available in this version)', 200);
      await addLine('', 50);

    } else if (mainCmd === 'print') {
      if (args.length === 0) {
        await addLine('Required parameter missing', 100);
      } else {
        await addLine('', 100);
        await addLine(`Printing ${args[0]}...`, 200);
        await addLine('Print queue is empty', 200);
        await addLine('', 50);
      }

    } else if (command === '') {
      // Empty command, do nothing :)

    } else {
      await addLine(`Bad command or file name`, 100);
      await addLine('', 50);
    }
  };

  return (
    <div className="terminal-container">
      <div className="crt-screen">
        <div className="scanlines"></div>
        <div className="crt-flicker"></div>

        <div className="terminal-output" ref={outputRef}>
          {output.map((line, i) => (
            <div key={i} className="terminal-line">{line}</div>
          ))}
          {!isBooting && (
            <div className="terminal-line">
              <span className="prompt">{currentDir}{'>'}</span>{input}
              <span className={`cursor ${cursorVisible ? 'visible' : ''}`}>█</span>
            </div>
          )}
        </div>
      </div>

      <div className="disclaimer">
        ⚠ DISCLAIMER: This is a visual DOS simulation for entertainment and educational purposes only. No actual file operations are performed.
      </div>
    </div>
  );
};

export default ReactDOS;