import gameWin from "../assets/sounds/gameWin.mp3";
import gameLose from "../assets/sounds/gameLose.mp3";
import buttonClick from "../assets/sounds/buttonClick.mp3";

import move from "../assets/sounds/move.mp3";
import capture from "../assets/sounds/capture.mp3";
import castle from "../assets/sounds/castle.mp3";
import promotion from "../assets/sounds/promotion.mp3";
import illegalMove from "../assets/sounds/illegalMove.mp3";
import check from "../assets/sounds/check.mp3";

import  tempoGain from "../assets/sounds/tempoGain.mp3";

import gun from "../assets/sounds/gun.mp3";
import gunfire from "../assets/sounds/gunfire.mp3";
import bomb from "../assets/sounds/bomb.mp3";
import bombExplosion from "../assets/sounds/bombExplosion.mp3";
import freeze from "../assets/sounds/freeze.mp3";
import iceBreak from "../assets/sounds/iceBreak.mp3";
import dashActivation from "../assets/sounds/dashActivation.mp3";
import phaseActivation from "../assets/sounds/phaseActivation.mp3";
import magnet from "../assets/sounds/magnet.mp3";
import forcePush from "../assets/sounds/forcePush.mp3";
import rock from "../assets/sounds/rock.mp3";
import royalDecreeActivation from "../assets/sounds/royalDecreeActivation.mp3";



const sounds = {
  // game logic
  //gameStart: new Audio(gameStart),
  gameWin: new Audio(gameWin),
  gameLose: new Audio(gameLose),
  buttonClick: new Audio(buttonClick),
  
  // movement
  move: new Audio(move),
  capture: new Audio(capture),
  castle: new Audio(castle),
  promotion: new Audio(promotion),
  illegalMove: new Audio(illegalMove),
  check: new Audio(check),
  //checkmate: new Audio(checkmate),

  //tempo
  tempoGain: new Audio(tempoGain),

  // cheats
  // cheatActivation: new Audio(cheatActivation),
  gun: new Audio(gun),
  gunfire: new Audio(gunfire),
  bomb: new Audio(bomb),
  bombExplosion: new Audio(bombExplosion),
  freeze: new Audio(freeze),
  iceBreak: new Audio(iceBreak),
  dashActivation: new Audio(dashActivation),
  phaseActivation: new Audio(phaseActivation),
  magnet: new Audio(magnet),
  forcePush: new Audio(forcePush),
  rock: new Audio(rock),
  royalDecreeActivation: new Audio(royalDecreeActivation),
};

export function playSound(name: keyof typeof sounds) {
  const sound = sounds[name].cloneNode() as HTMLAudioElement;
  sound.volume = 0.5;
  sound.play().catch(() => {});
}