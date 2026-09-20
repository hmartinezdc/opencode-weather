# Revisión Weather CLI

- [x] **Colores:** no hay ninguno; falta definir cyan (menú), amarillo (temp), verde/rojo (ok/error).
- [ ] **AGENTS.md:** dice que `index.ts` es stub, pero la app ya funciona — hay que actualizarlo.
- [ ] **Ciudades:** geocoding solo trae 1 resultado; nombres ambiguos pueden fallar.
- [ ] **Tests:** no existen; conviene al menos probar storage y las APIs con mocks.
- [ ] **Binario:** compila bien; revisar que `./weather.exe` guarde datos en `sr/weather-cli/`.
- [ ] **Escalabilidad:** ¿qué tan fácil será expandir con nuevas funcionalidades?
- [ ] **Carga:** ¿hay estado de carga en las tareas asíncronas?
- [ ] **7 Day forecast:** agregar la posibilidad de obtener el pronóstico del cima para los próximos 7 días.

## CheckList adicional de revisión

- [ ] ¿Usaron ramas?
- [ ] ¿Usaron pull requests?
- [ ] ¿Qué pasa si tras un nuevo feature, se rompío otras cosa?
- [ ] ¿Hicieron el testing? ¿Qué probaron?
- [ ] ¿Su modelo instaló dependencias? ¿Qué dependencias instaló? ¿Están de cuerdo ustedes?
- [ ] ¿Comprenden el código? ¿Qué es lo que hacer? ¿Qué es lo que no hace?

