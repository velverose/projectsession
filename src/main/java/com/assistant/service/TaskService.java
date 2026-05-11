package com.assistant.service;

import com.assistant.dto.TaskDto;
import com.assistant.model.Task;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TaskService {

    // In-Memory хранилище (по ТЗ)
    private final List<Task> tasks = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong(1);

    public List<Task> getAllTasks() {
        return new ArrayList<>(tasks);
    }

    public Optional<Task> getTaskById(Long id) {
        return tasks.stream().filter(task -> task.getId().equals(id)).findFirst();
    }

    public Task createTask(TaskDto taskDto) {
        Task newTask = new Task(counter.getAndIncrement(), taskDto.getTitle(), taskDto.getDescription(), taskDto.isCompleted());
        tasks.add(newTask);
        return newTask;
    }

    public Optional<Task> updateTask(Long id, TaskDto taskDto) {
        Optional<Task> existingTask = getTaskById(id);
        existingTask.ifPresent(task -> {
            task.setTitle(taskDto.getTitle());
            task.setDescription(taskDto.getDescription());
            task.setCompleted(taskDto.isCompleted());
        });
        return existingTask;
    }

    public boolean deleteTask(Long id) {
        return tasks.removeIf(task -> task.getId().equals(id));
    }
}
