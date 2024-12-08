package org.AlekseyShugol;

import org.AlekseyShugol.passwordUtil.PasswordUtil;

import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        String password = "mySecurePassword";
        String password2 = "1234";

        // Хешируем пароль
        String hashed = PasswordUtil.hashPassword(password2);
        System.out.println("hashed: " + hashed);

        Scanner scanner = new Scanner(System.in);
        String a = scanner.nextLine();
        boolean isMatch = PasswordUtil.checkPassword(password2, hashed);
        System.out.println("isTrue: " + isMatch);

//        // Проверяем пароль
//        boolean isMatch = PasswordUtil.checkPassword(password, hashed);
//        System.out.println("isTrue: " + isMatch);
    }
}