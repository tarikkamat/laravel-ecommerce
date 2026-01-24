<?php

namespace App\Repositories;

use App\Repositories\Contracts\IBaseRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements IBaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(array $columns = ['*'], array $relations = []): Collection
    {
        return $this->model->newQuery()->with($relations)->get($columns);
    }

    public function paginate(
        int $perPage = 15,
        array $columns = ['*'],
        array $relations = []
    ): LengthAwarePaginator {
        return $this->model->newQuery()->with($relations)->paginate($perPage, $columns);
    }

    public function find(int $id, array $columns = ['*'], array $relations = []): ?Model
    {
        return $this->model->newQuery()->with($relations)->find($id, $columns);
    }

    public function findOrFail(int $id, array $columns = ['*'], array $relations = []): Model
    {
        return $this->model->newQuery()->with($relations)->findOrFail($id, $columns);
    }

    public function create(array $data): Model
    {
        return $this->model->newQuery()->create($data);
    }

    public function update(int $id, array $data): Model
    {
        $model = $this->findOrFail($id);
        $model->fill($data);
        $model->save();

        return $model;
    }

    public function delete(int $id): bool
    {
        $model = $this->findOrFail($id);

        return (bool) $model->delete();
    }
}
