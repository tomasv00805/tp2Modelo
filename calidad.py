import random

def generar_lote(probabilidad_defecto, tamaño_lote):
    """
    Genera un lote de placas de video con una probabilidad de defecto aleatoria.
    """
    lote = [1 if random.random() < probabilidad_defecto else 0 for _ in range(tamaño_lote)]
    return lote

def seleccionar_muestra(lote, tamaño_muestra):
    """
    Selecciona una muestra aleatoria de placas de video del lote.
    """
    muestra = random.sample(lote, tamaño_muestra)
    return muestra

def inspeccionar_muestra(muestra):
    """
    Inspecciona las placas de video de la muestra y calcula la proporción de placas defectuosas.
    """
    total_defectuosas = sum(muestra)
    print(total_defectuosas)
    prop_defectuosas = total_defectuosas / len(muestra)
    return prop_defectuosas

def determinar_estado_lote(prop_defectuosas, limite_aceptacion):
    """
    Determina si el lote es aprobado o rechazado según la proporción de placas defectuosas en la muestra.
    """
    if prop_defectuosas <= limite_aceptacion:
        return "Aprobado"
    else:
        return "Rechazado"

def simular_control_calidad(probabilidad_defecto, tamaño_lote, tamaño_muestra, limite_aceptacion, num_simulaciones):
    """
    Simula el proceso de control de calidad para un número dado de lotes.
    """
    for i in range(num_simulaciones):
        lote = generar_lote(probabilidad_defecto, tamaño_lote)
        muestra = seleccionar_muestra(lote, tamaño_muestra)
        prop_defectuosas = inspeccionar_muestra(muestra)
        estado_lote = determinar_estado_lote(prop_defectuosas, limite_aceptacion)
        print(f"Lote {i+1}: {estado_lote}")

# Parámetros de simulación
probabilidad_defecto = 0.10  # Ejemplo: 10% de probabilidad de defecto
tamaño_lote = 100  # Ejemplo: tamaño del lote
tamaño_muestra = 100  # Ejemplo: tamaño de la muestra
limite_aceptacion = 0.10  # Ejemplo: 5% de límite de aceptación
num_simulaciones = 5  # Ejemplo: número de lotes a simular

# Ejecutar la simulación
simular_control_calidad(probabilidad_defecto, tamaño_lote, tamaño_muestra, limite_aceptacion, num_simulaciones)
