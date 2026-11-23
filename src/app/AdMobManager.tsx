"use client";

import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  AdOptions,
} from "@capacitor-community/admob";

// ⚠️ CAMBIA A false JUSTO ANTES DE GENERAR EL PAQUETE FINAL PARA GOOGLE PLAY
const MODO_PRUEBA = true;

const IDS = {
  banner: MODO_PRUEBA
    ? "ca-app-pub-3940256099942544/6300978111" // ID oficial de prueba Google
    : "ca-app-pub-7833811584621376/6178827628", // Tu Banner Principal real
  intersticial: MODO_PRUEBA
    ? "ca-app-pub-3940256099942544/1033173712" // ID oficial de prueba Google
    : "ca-app-pub-7833811584621376/8613419276", // Tu Intersticial Navegacion real
};

export default function AdMobManager() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let intervaloIntersticial: ReturnType<typeof setInterval>;

    const iniciarAnuncios = async () => {
      try {
        await AdMob.initialize({
          initializeForTesting: MODO_PRUEBA,
        });

        // 1. Mostrar Banner adaptable en la parte inferior
        const opcionesBanner: BannerAdOptions = {
          adId: IDS.banner,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: MODO_PRUEBA,
        };
        await AdMob.showBanner(opcionesBanner);

        // 2. Preparar y mostrar Intersticial de forma segura (cada 3 minutos)
        const lanzarIntersticial = async () => {
          try {
            const opcionesInter: AdOptions = {
              adId: IDS.intersticial,
              isTesting: MODO_PRUEBA,
            };
            await AdMob.prepareInterstitial(opcionesInter);
            await AdMob.showInterstitial();
          } catch (err) {
            console.log("Intersticial aún cargando:", err);
          }
        };

        // Primer intersticial tras 90 segundos de uso activo, luego cada 3 minutos
        const primerAviso = setTimeout(() => {
          lanzarIntersticial();
          intervaloIntersticial = setInterval(lanzarIntersticial, 180000);
        }, 90000);

        return () => clearTimeout(primerAviso);
      } catch (error) {
        console.error("Error iniciando AdMob:", error);
      }
    };

    iniciarAnuncios();

    return () => {
      if (intervaloIntersticial) clearInterval(intervaloIntersticial);
    };
  }, []);

  return null;
}
