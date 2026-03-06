const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Sirve el frontend (index.html)
app.use(express.static(path.join(process.cwd()), {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// CATÁLOGO REAL BELIER - Actualizado según portafolio oficial
const CATALOGO_BELIER = `
CATÁLOGO OFICIAL DE PRODUCTOS BELIER (Cosméticos Belier - Laboratorios Becapro S.A.S.)
Marca colombiana, 25 años en el mercado. Vegan, Cruelty Free, sin tóxicos.

=== LÍNEA S.O.S - TRATAMIENTO RESTAURADOR ===
Tratamiento restaurador con extractos naturales de apio y otros productos naturales que fomentan la diferenciación de células ungueales y promueven la producción de ceramidas y queratinas. 21 FREE. Cruelty Free. Vegano.

1. S.O.S Apio (Base Restauradora)
   - Para uñas dañadas por mal retiro de sistemas artificiales (acrílico, gel, polygel)
   - Mejora la estructura de la uña rápidamente
   - Disponible en 2 tamaños

2. S.O.S Apio & Calcio
   - Para uñas débiles que necesitan más resistencia
   - Revitaliza la salud de la uña

3. S.O.S Apio & Cebolla
   - Para fortalecer uñas y revitalizar su apariencia
   - Recomendada para uñas que no crecen o crecen lento

4. S.O.S Apio & Keratina
   - Ideal para uñas naturales
   - Recomendada para niños y hombres
   - Fortalece con keratina natural

=== LÍNEA ARGÁN - TRATAMIENTO REGENERADOR (NO es aceite) ===
5. Argán Tratamiento Regenerador (3 en 1: base, color y brillo)
   - NO es un aceite, es un tratamiento fortalecedor intensivo
   - Activa el crecimiento de uñas débiles o maltratadas por uso excesivo o retiro inadecuado
   - Protocolo de 7 días: Día 1 aplicar 2 capas, Días 2-7 agregar una capa diaria sin retirar, Día 8 retirar
   - 21 FREE. No aplicar más de 2 veces seguidas el tratamiento
   - Variantes: Argán Violeta, Argán Visos, Argán Nude Boreal (13ml cada uno)

=== ESMALTE PROFESIONAL 21 FREE ===
6. Esmalte Profesional 21 FREE
   - Más de 90 posibilidades de color
   - Sin 21 químicos dañinos (tolueno, benceno, formaldehído, ftalatos, siliconas cíclicas, alcanfor, etc.)
   - Con extractos naturales: Ajo, Áloe, Romero, Tomillo, Canela
   - Secado rápido, color intenso y duradero, máximo cubrimiento
   - No requiere lámpara UV/LED
   - Cruelty Free

=== BIOGEL MASTER - LÍNEA EFECTO GEL ===
7. BioGel Master 25 FREE (Efecto Gel sin lámpara)
   - Esmalte de secado rápido con efecto gel impecable
   - 72% origen vegetal (caña de azúcar, yuca, maíz, algodón)
   - 25 FREE - el más saludable del mercado
   - Larga duración: 10 a 15 días según aplicación
   - Sistema de 3 pasos: Paso 1 Base / Paso 2 Tono (color) / Paso 3 Brillo
   - No requiere lámpara UV/LED
   - Cruelty Free

=== LÍNEA TOP COAT - FINALIZADORES ===
8. Top Coat Brillo Gel (13ml)
   - Laca selladora a base de gel
   - Aumenta el brillo del esmalte y prolonga la durabilidad
   - Acelera el secado
   - Modo de aplicación distinto al convencional

9. Top Coat Finish Mate (13ml)
   - Finalizador que genera tono mate elegante en las uñas

10. Top Coat Brillo Secante (13ml / 250ml)
    - Evita la fractura del esmalte
    - Intensifica el brillo del color
    - Secado más rápido que lo habitual

=== REMOVEDOR DE ESMALTE ===
11. Removedor de Esmalte
    - 100% libre de acetona y tolueno
    - Con aceites naturales humectantes
    - No reseca uñas ni dedos
    - Disponible en: 60ml, 120ml, 250ml, 1Lt, 4Lt
    - Manicura ambientalmente responsable

=== DESENGRASANTE DE UÑAS ===
12. Desengrasante de Uñas
    - Con extracto de tomillo (agente cicatrizante)
    - Propiedades antibacteriales y dermo protectoras
    - Prepara las uñas antes del esmalte
    - Garantiza máxima duración del esmalte
    - Disponible en: 120ml, 1Lt

=== CREMAS HUMECTANTES ===
13. Crema Humectante
    - Con áloe vera, argán, coco, vitamina E y filtro solar
    - Facilita regeneración celular de la piel
    - Sin parabenos. No testeada en animales
    - Disponible en: 120ml, 1Lt

=== REMOVEDORA DE CUTÍCULA ===
14. Crema Removedora de Cutícula
    - Elimina manchas en uñas y suaviza callosidades
    - Con propilenglicol para proteger e hidratar la piel
    - Resistente al agua
    - Disponible en: 120ml, 1Lt

15. Líquido Removedor de Cutícula
    - Mayor concentración de agentes removedores
    - Impermeable al agua
    - Disponible en: 60ml, 120ml

=== ACEITES HUMECTANTES ===
16. Aceite de Almendras con Vitamina E
    - Fórmula ligera de rápida absorción
    - Vitamina E y filtro solar
    - Sin parabenos. No testeado en animales
    - Disponible en: 120ml, 1Lt

17. Aceite de Uva (Hipoalergénico)
    - Ideal para pieles sensibles con alto grado de resequedad
    - Antioxidante, ayuda al aclaramiento de zonas oscuras
    - Disponible en: 120ml, 1Lt

=== CREMA EXFOLIANTE ===
18. Crema Exfoliante de Uva
    - Hipoalergénica, ideal para pieles sensibles y resecas
    - Sin parabenos
    - Disponible en: 120ml, 1Lt

19. Crema Exfoliante de Albaricoque
    - Con semillas naturales de albaricoque y uva
    - Remueve impurezas de la piel
    - Sin parabenos

=== REMOVEDOR DE CALLOS ===
20. Removedor de Callos
    - Elimina durezas y callosidades
    - Protege e hidrata la piel
    - Disponible en: 120ml, 1Lt

=== LÍNEA SPA POMELO VAINILLA ===
21. Sales Relajantes Pomelo Vainilla
    - Sales de Manaure (La Guajira), aceite de pomelo vainilla
    - Flores secas de lavanda, tomillo y caléndula

22. Mascarilla Peel-Off con extracto de Uchuva
    - Retira células muertas
    - Fórmula rica en antioxidantes
    - Piel radiante

23. Manticare - Mantequilla Humectante
    - Con hammamelis, áloe vera, argán, coco y vitamina E
    - Humectación profunda

24. Vela Hidratante Pomelo Vainilla
    - Con hammamelis, áloe vera, argán, coco y vitamina E
    - Humectación profunda

=== LÍNEA FOR MEN ===
25. For Men - Crema Humectante
    - Altamente humectante, rápida absorción
    - Con hammamelis, áloe vera, argán, coco, vitamina E
    - Sin parabenos. Fórmula mejorada. 250ml

26. For Men - Aceite con Vitamina E
    - Mezcla de humectantes con Vitamina E y filtro solar
    - Mayor elasticidad de la piel
    - Protege de agentes externos. 250ml

27. For Men - Crema Exfoliante
    - Limpieza profunda sin enjuague
    - Fragancia premium
    - Sin parabenos. Hidratación excepcional en manos y pies. 250ml

=== NAILS BOND (USO PROFESIONAL) ===
28. Nails Bond Sin Ácido
    - Elimina humedad y grasa de las uñas
    - Garantiza adhesión óptima con acrílico o gel
    - Sin lámpara UV. 13ml

=== LÍNEA SPA PROFESIONAL ===
Productos para uso en spa y salones profesionales de manicura.
`;

app.post('/analyze', async (req, res) => {
  try {
    const { image, answers } = req.body;
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stateMap = {
      debiles: 'uñas débiles que se quiebran fácilmente',
      danadas: 'uñas dañadas por acrílico, gel o retiro inadecuado',
      manchas: 'uñas con manchas o decoloración',
      lentas: 'uñas que no crecen o crecen muy lento',
      buenas: 'uñas en buen estado, solo quiere cuidarlas'
    };
    const esmalteMap = {
      tradicional: 'usa esmalte tradicional',
      semipermanente: 'usa semipermanente con lámpara',
      efecto_gel: 'prefiere efecto gel sin lámpara',
      ninguno: 'prefiere solo tratamiento sin color'
    };
    const pielMap = {
      resequedad: 'piel muy seca y cutículas endurecidas',
      normal: 'piel normal sin problemas',
      sensible: 'piel sensible o con irritación frecuente',
      callos: 'callosidades en manos o pies'
    };
    const necesidadMap = {
      hombre: 'es hombre y busca cuidado específico masculino',
      spa: 'quiere una rutina SPA completa en casa',
      profesional: 'es manicurista o profesional',
      ninguna: 'sin necesidad especial'
    };
    const prioridadMap = {
      salud: 'prioriza productos saludables y sin tóxicos',
      duracion: 'prioriza larga duración',
      tratamiento: 'prioriza tratamiento y reparación',
      color: 'prioriza variedad de colores'
    };

    const answersText = `
Estado de uñas: ${stateMap[answers.q1] || answers.q1}
Tipo de esmalte: ${esmalteMap[answers.q2] || answers.q2}
Estado de la piel: ${pielMap[answers.q3] || answers.q3}
Necesidad especial: ${necesidadMap[answers.q4] || answers.q4}
Prioridad: ${prioridadMap[answers.q5] || answers.q5}
    `.trim();

    const messages = [];

    if (image) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: image }
          },
          {
            type: 'text',
            text: `Eres una experta en cuidado de uñas de la marca colombiana Belier. Analiza esta imagen de uñas y las respuestas del diagnóstico del usuario:

${answersText}

${CATALOGO_BELIER}

IMPORTANTE:
- El Argán es un TRATAMIENTO REGENERADOR INTENSIVO, NO un aceite
- Solo recomienda productos del catálogo oficial anterior
- Sé específica y empática
- Responde en español, máximo 4 oraciones
- Da un análisis personalizado del estado de las uñas y por qué los productos recomendados son ideales para este caso`
          }
        ]
      });
    } else {
      messages.push({
        role: 'user',
        content: `Eres una experta en cuidado de uñas de la marca colombiana Belier. Basada en las respuestas del diagnóstico:

${answersText}

${CATALOGO_BELIER}

IMPORTANTE:
- El Argán es un TRATAMIENTO REGENERADOR INTENSIVO, NO un aceite
- Solo menciona productos del catálogo oficial anterior
- Sé específica y empática
- Responde en español, máximo 4 oraciones
- Da un análisis personalizado y explica por qué los productos recomendados son ideales para este caso`
      });
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 300,
      messages
    });

    res.json({ analysis: response.content[0].text });
  } catch (error) {
    console.error('Error en análisis:', error);
    res.status(500).json({ error: 'Error al procesar el análisis' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Belier corriendo en puerto ${PORT}`));
