package com.ai.e_learning.service;

import com.ai.e_learning.dto.ExcelUploadDto;
import com.ai.e_learning.model.Role;
import com.ai.e_learning.model.User;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class ExcelUploadService {

    public static boolean isValidExcelFile(MultipartFile file) {
        return Objects.equals(file.getContentType(),"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }

    public static ExcelUploadDto getUserDataFromExcel(InputStream inputStream) {
        List<User> users = new ArrayList<>();
        List<String> roles = new ArrayList<>();
        String role =null;
        try (XSSFWorkbook workbook = new XSSFWorkbook(inputStream)) {
            XSSFSheet sheet = workbook.getSheet("Employee_Data");
            if (sheet == null) {
                throw new RuntimeException("Sheet 'Employee_Data' not found");
            }

            int rowIndex = 0;
            for (Row row : sheet) {
                if (rowIndex < 3) { // Skip first 3 rows
                    rowIndex++;
                    continue;
                }Iterator<Cell> cellIterator = row.cellIterator();
                int cellIndex = 0;
                User user = new User();


                while (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();
                    switch (cellIndex) {
                        case 0 -> user.setId((long) cell.getNumericCellValue());
                        case 1 -> user.setDivision(cell.getStringCellValue());
                        case 2 -> user.setStaffId(cell.getStringCellValue());
                        case 3 -> user.setName(cell.getStringCellValue());
                        case 4 -> user.setDoorLogNo((long)cell.getNumericCellValue());
                        case 5 -> user.setDepartment(cell.getStringCellValue());
                        case 6 -> user.setTeam(cell.getStringCellValue());
                        case 7 -> user.setEmail(cell.getStringCellValue());
                        case 8 -> user.setStatus(cell.getStringCellValue());
                        case 9 -> role =cell.getStringCellValue();
                        default -> {
                        }
                    }
                    cellIndex++;
                }
                users.add(user);
                System.out.println(role);
                roles.add(role);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        ExcelUploadDto excelUploadDto = new ExcelUploadDto();
        excelUploadDto.setUserList(users);
        excelUploadDto.setRoles(roles);
        return excelUploadDto;
    }


}
