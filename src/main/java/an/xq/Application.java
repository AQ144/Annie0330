package an.xq;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;

/**
 * Created by xiongqing on 2016-05-05.
 */

@SpringBootApplication
public class Application {

    private static ConfigurableApplicationContext appCtx;

    public static void main(String[] args){
        System.out.println("hello");
        appCtx = SpringApplication.run(Application.class, args);

    }

}
