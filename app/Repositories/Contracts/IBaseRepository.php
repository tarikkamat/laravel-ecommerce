<?php

namespace App\Repositories\Contracts;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface IBaseRepository
{
    public function all(array $columns = ['*'], array $relations = []): Collection;

    public function paginate(
        int $perPage = 15,
        array $columns = ['*'],
        array $relations = []
    ): LengthAwarePaginator;

    public function find(int $id, array $columns = ['*'], array $relations = []): ?Model;

    public function findOrFail(int $id, array $columns = ['*'], array $relations = []): Model;

    public function create(array $data): Model;

    public function update(int $id, array $data): Model;

    public function delete(int $id): bool;
}
