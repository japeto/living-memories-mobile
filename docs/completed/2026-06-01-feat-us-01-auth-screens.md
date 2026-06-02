# fix: Corrección de precisión visual en la Autenticación
# Types: fix

## Summary
Resolver problemas de precisión visual en las pantallas de Login y Register: asegurar la carga de las fuentes personalizadas (`Nunito` y `Lora`), centrar los elementos del componente `AuthHeader`, y corregir el renderizado del componente `Button` pasándole el texto como `children` en lugar de una prop `title`.

## Scope
- Carga de fuentes en la entrada de la aplicación (`App.js`).
- Ajustes de alineación en el componente `AuthHeader`.
- Ajustes de instanciación del componente `Button` en las pantallas de Login y Registro (`LoginScreen.tsx` y `RegisterScreen.tsx`).

## Files to Create / Modify
| File | Action | Description |
|------|--------|-------------|
| `App.js` | Modify | Importar y usar `useFonts` con `@expo-google-fonts/nunito` y `@expo-google-fonts/lora`, mapeando los nombres exactos (`Nunito_500`, `Lora_500`, etc.). Retornar `null` o el `SplashScreen` si las fuentes no han cargado. |
| `src/presentation/components/AuthHeader.tsx` | Modify | Añadir `alignItems: 'center'` al `View` contenedor y `textAlign: 'center'` a los componentes `Text` internos. |
| `src/presentation/screens/auth/LoginScreen.tsx` | Modify | Cambiar el uso de `Button` de `<Button title="Ingresar" ... />` a `<Button onPress={...} iconRight="arrow">Ingresar</Button>`. |
| `src/presentation/screens/auth/RegisterScreen.tsx` | Modify | Cambiar el uso de `Button` de `<Button title="Registrarme" ... />` a `<Button onPress={...} iconRight="arrow">Registrarme</Button>`. |
| `package.json` | Modify | Instalar `@expo-google-fonts/nunito` y `@expo-google-fonts/lora` (si no están instalados). |

## Business Logic / Change Description
1. **Fuentes no cargadas**: 
   - Instalar `@expo-google-fonts/nunito` y `@expo-google-fonts/lora`.
   - En `App.js`, utilizar el hook `useFonts` y mapear los nombres exactos esperados por el sistema de tokens (`tokens.ts`):
     - `Nunito_500: Nunito_500Medium`
     - `Nunito_600: Nunito_600SemiBold`
     - `Nunito_700: Nunito_700Bold`
     - `Nunito_800: Nunito_800ExtraBold`
     - `Lora_500: Lora_500Medium`
   - Si las fuentes aún no están listas, evitar renderizar la app.

2. **Centrado del AuthHeader**: 
   - En `AuthHeader.tsx`, el contenedor principal `View` debe llevar la propiedad `alignItems: 'center'`.
   - A los elementos `<Text>` correspondientes al título y al subtítulo, asignarles un estilo `textAlign: 'center'`.

3. **Botón Vacío**:
   - En `LoginScreen.tsx` y `RegisterScreen.tsx`, el componente `Button` está esperando su texto en `children`, no en una prop `title` (lo que causaba un renderizado de un botón gigante sin texto).
   - Reemplazar las instancias actuales por el formato: `<Button onPress={vm.onLogin} iconRight="arrow" ...>Ingresar</Button>`. (y lo mismo para registrar).

## Acceptance Criteria
- [ ] Las fuentes de diseño (`Nunito` y `Lora`) se visualizan correctamente en toda la app sin fallback a la del sistema.
- [ ] El logotipo y el texto del encabezado en `AuthHeader` están perfectamente centrados de manera horizontal.
- [ ] El botón principal de ambas pantallas de Auth se renderiza correctamente, mostrando su texto interno ("Ingresar" / "Registrarme") y el icono a la derecha.

## Open Questions / Risk Alerts
- ¿Es necesario añadir `Lora_500_Italic` a la carga de fuentes si algún token lo utiliza eventualmente? (Por ahora se cubre el requisito de la fuente redondeada en títulos).
