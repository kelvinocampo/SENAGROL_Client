export type RoleCounts = {
  comprador: number;
  vendedor: number;
  transportador: number;
  administrador: number;
};

export const getUserRoleCounts = (users: any[]): RoleCounts => {
  const counts: RoleCounts = {
    comprador: 0,
    vendedor: 0,
    transportador: 0,
    administrador: 0,
  };

  users.forEach((user) => {
    (['comprador', 'vendedor', 'transportador', 'administrador'] as const).forEach((role) => {
      if (user[role] === 'Activo') {
        counts[role]++;
      }
    });
  });

  return counts;
};
