# 12 V → 5 V Buck Converter

A 12 V to 5 V step-down (buck) DC–DC converter designed in **KiCad 10**, simulated in **LTspice**, and presented as an interactive, scroll-driven engineering walkthrough.

**Live site → https://jatt47508.github.io/Buck-Converter/**

## Overview

The converter switches a 12 V input at 100 kHz through a 47 µH inductor and a 220 µF output capacitor, delivering a 5 V-class rail into a 2.5 Ω load. The repository contains the real design sources: the KiCad schematic, a 2-layer PCB, the STEP model, and the LTspice transient deck.

The website takes the board apart in 3D, explains the switching states, plots the simulated waveforms, inspects the PCB layout, and lets you orbit and probe the assembled board in a final interactive lab.

## Simulated results

Measured from the committed LTspice transient run (10 ms, time-weighted):

| Quantity | Value |
| --- | --- |
| Average output | 4.910 V |
| Output ripple | 59.2 mV (1.21 %) |
| Duty cycle | 44.6 % |
| Inductor current | 1.965 A avg, 0.797 A ripple |
| Efficiency | 90.9 % at 2.5 Ω |
| Switching frequency | 100 kHz |

These are **simulation results, not bench measurements**. The ideal duty-cycle figure (41.7 %) and the simulated duty cycle differ because of diode and conduction losses.

## Project status — draft revision

This is an honest draft, not a validated or fabricated design. A design review of the committed PCB found:

- The MOSFET gate pad is marked **no-connect** and has no driver.
- Two MOSFET drain pads have no net assigned.
- The `/Vin` net reaches only the input jack — 12 V does not reach the switch.

There is no DRC report in the repository, and the board has not been manufactured or measured. The website states these findings directly rather than presenting the layout as production-ready.

## What's in the repository

- `12V_to_5V_Buck/` — KiCad project (`.kicad_sch`, `.kicad_pcb`, `.kicad_pro`) and `buck_converter.step`
- `LTspice/` — transient deck, plot settings, and related simulation schematics
- `src/` — the interactive site (React + TypeScript + three.js)
- `public/` — derived 3D models, renders, schematic export, and the waveform CSV

## Site sections

1. **Assembly** — scroll-driven 3D reveal, explode, and annotated assembly
2. **Introduction** — what the board is and what it is not
3. **Working principle** — switching states and the ideal duty-cycle relationship
4. **Circuit** — schematic, component list, nets, and review findings
5. **Simulation** — waveforms, operating point, and an ideal buck calculator
6. **PCB** — real renders, stack-up, dimensions, and layout review
7. **Downloads** — the actual KiCad, STEP, LTspice, and CSV files
8. **PCB Lab** — orbit, explode, and inspect the board interactively

## Built with

React 19 · TypeScript · Vite · three.js / React Three Fiber · KiCad 10 · LTspice
Type: Anton, Archivo, IBM Plex Mono.

## Academic project

Built as an academic power-electronics project. Simulation data comes from the included LTspice deck; design files come from the included KiCad project. All third-party libraries remain under their respective licenses.
