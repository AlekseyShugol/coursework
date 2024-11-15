package org.example;

import org.example.passwordUtil.PasswordUtil;

public class Main {
    public static void main(String[] args) {
        String password = "mySecurePassword";

        // Хешируем пароль
        String hashed = PasswordUtil.hashPassword(password);
        System.out.println("Хешированный пароль: " + hashed);

        // Проверяем пароль
        boolean isMatch = PasswordUtil.checkPassword(password, hashed);
        System.out.println("Пароль совпадает: " + isMatch);
    }
}