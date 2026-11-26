"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";

import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  AdOptions,
  RewardInterstitialAdOptions,
  RewardInterstitialAdPluginEvents,
} from "@capacitor-community/admob";

// CAMBIA A false JUSTO ANTES DE GENERAR EL PAQUETE FINAL PARA GOOGLE PLAY
const MODO_PRUEBA = true;

export const IDS_ADMOB = {
  banner: MODO_PRUEBA
    ? "ca-app-pub-3940256099942544/6300978111"
    : "ca-app-pub-7833811584621376/6178827628",
  intersticial: MODO_PRUEBA
    ? "ca-app-pub-3940256099942544/1033173712"
    : "ca-app-pub-7833811584621376/8613419276",
recompensado: MODO_PRUEBA
  ? "ca-app-pub-3940256099942544/5354046379"
  : "ca-app-pub-1290211641432693/2878366671",

  nativo: MODO_PRUEBA
    ? "ca-app-pub-3940256099942544/2247696110"
    : "ca-app-pub-7833811584621376/8613419276",
};

const INTERVALO_MINIMO_INTERSTICIAL_MS = 180000; // Máximo 1 cada 3 minutos
let ultimoIntersticialTs = 0;
let pantallaSensibleActiva = false;

export async function controlarVisibilidadBanner(ocultar: boolean) {
  pantallaSensibleActiva = ocultar;
  if (!Capacitor.isNativePlatform()) return;
  try {
    if (ocultar) {
      await AdMob.hideBanner();
    } else {
      await AdMob.resumeBanner();
    }
  } catch {}
}

export async function mostrarIntersticialAlSalirVideo() {
  if (!Capacitor.isNativePlatform() || pantallaSensibleActiva) return;
  const ahora = Date.now();
  if (ahora - ultimoIntersticialTs < INTERVALO_MINIMO_INTERSTICIAL_MS) return;

  try {
    const opcionesInter: AdOptions = {
      adId: IDS_ADMOB.intersticial,
      isTesting: MODO_PRUEBA,
    };
    await AdMob.prepareInterstitial(opcionesInter);
    await AdMob.showInterstitial();
    ultimoIntersticialTs = Date.now();
  } catch (err) {
    console.log("Intersticial aún preparando:", err);
  }
}

let mostrandoRecompensado = false;

export async function mostrarAnuncioRecompensado(onRecompensaGanada: () => void): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    onRecompensaGanada();
    return true;
  }
  if (mostrandoRecompensado) return false;
  mostrandoRecompensado = true;

  try {
    let recompensaOtorgada = false;
    const rewardListener = await AdMob.addListener(
      RewardInterstitialAdPluginEvents.Rewarded,
      () => {
        recompensaOtorgada = true;
        onRecompensaGanada();
      }
    );

    const cerradoPromesa = new Promise<void>(async (resolve) => {
      const dismissListener = await AdMob.addListener(
        RewardInterstitialAdPluginEvents.Dismissed,
        () => {
          dismissListener.remove();
          resolve();
        }
      );
      const failedListener = await AdMob.addListener(
        RewardInterstitialAdPluginEvents.FailedToShow,
        () => {
          failedListener.remove();
          resolve();
        }
      );
    });

    const opcionesReward: RewardInterstitialAdOptions = {
      adId: IDS_ADMOB.recompensado,
      isTesting: MODO_PRUEBA,
    };
    await AdMob.prepareRewardInterstitialAd(opcionesReward);
    await AdMob.showRewardInterstitialAd();
    await cerradoPromesa;
    await rewardListener.remove();
    return recompensaOtorgada;
  } catch (err) {
    console.log("Error en anuncio recompensado:", err);
    return false;
  } finally {
    mostrandoRecompensado = false;
  }
}


export default function AdMobManager() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const iniciarAnuncios = async () => {
      try {
        await AdMob.initialize({
          initializeForTesting: MODO_PRUEBA,
        });

        const opcionesBanner: BannerAdOptions = {
          adId: IDS_ADMOB.banner,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: MODO_PRUEBA,
        };
        await AdMob.showBanner(opcionesBanner);
      } catch (error) {
        console.error("Error iniciando AdMob:", error);
      }
    };

    iniciarAnuncios();
  }, []);

  return null;
}
