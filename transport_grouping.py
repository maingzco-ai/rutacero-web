import time
from datetime import datetime
from typing import List, Dict, Any

def group_and_confirm(requests: List[Dict[str, Any]], capacity: int) -> List[List[Dict[str, Any]]]:
    """
    Agrupa solicitudes de transporte por destino y ventana de 15 minutos,
    confirma grupos que no superan el capacidad del vehículo.

    Args:
        requests: Lista de diccionarios con claves:
                 'user_id': identificador del usuario,
                 'destination': destino (ej. 'Unicentro', 'Holguines'),
                 'departure_time': objeto datetime de la hora de salida.
        capacity: Capacidad máxima del vehículo (número de pasajeros).

    Returns:
        Lista de grupos confirmados (cada grupo es una lista de solicitudes).
    """
    start_time = time.perf_counter()

    # Agrupar solicitudes por destino
    grouped_by_destination = {}
    for req in requests:
        dest = req['destination']
        if dest not in grouped_by_destination:
            grouped_by_destination[dest] = []
        grouped_by_destination[dest].append(req)

    confirmed_groups = []

    # Procesar cada destino
    for destination, req_list in grouped_by_destination.items():
        # Ordenar por hora de salida
        req_list.sort(key=lambda x: x['departure_time'])

        i = 0
        n = len(req_list)
        while i < n:
            # Iniciar un nuevo grupo con la solicitud actual
            current_group = [req_list[i]]
            group_start_time = req_list[i]['departure_time']
            j = i + 1

            # Agregar solicitudes que estén dentro de 15 minutos desde el inicio del grupo
            while j < n:
                time_diff = (req_list[j]['departure_time'] - group_start_time).total_seconds()
                if time_diff <= 900:  # 15 minutos en segundos
                    current_group.append(req_list[j])
                    j += 1
                else:
                    break

            # Confirmar el grupo si no supera la capacidad
            if len(current_group) <= capacity:
                confirmed_groups.append(current_group)

            # Mover al siguiente grupo no procesado
            i = j

    end_time = time.perf_counter()
    elapsed_time = end_time - start_time
    print(f"Tiempo de respuesta: {elapsed_time:.2f} segundos")

    return confirmed_groups


# Ejemplo de uso (para pruebas)
if __name__ == "__main__":
    # Datos de ejemplo
    sample_requests = [
        {
            'user_id': 'est001',
            'destination': 'Unicentro',
            'departure_time': datetime(2026, 10, 2, 8, 0, 0)
        },
        {
            'user_id': 'est002',
            'destination': 'Unicentro',
            'departure_time': datetime(2026, 10, 2, 8, 5, 0)
        },
        {
            'user_id': 'est003',
            'destination': 'Unicentro',
            'departure_time': datetime(2026, 10, 2, 8, 12, 0)
        },
        {
            'user_id': 'est004',
            'destination': 'Holguines',
            'departure_time': datetime(2026, 10, 2, 8, 0, 0)
        },
        {
            'user_id': 'est005',
            'destination': 'Holguines',
            'departure_time': datetime(2026, 10, 2, 8, 20, 0)
        }
    ]

    # Capacidad del vehículo (ejemplo: 4 pasajeros)
    vehicle_capacity = 4

    # Ejecutar la función
    confirmed = group_and_confirm(sample_requests, vehicle_capacity)
    print("\nGrupos confirmados:")
    for i, group in enumerate(confirmed, 1):
        print(f"Grupo {i}: {len(group)} solicitudes")
        for req in group:
            print(f"  Usuario {req['user_id']} -> {req['destination']} a las {req['departure_time'].strftime('%H:%M')}")